import { FormSchema } from "@/app/(editor)/comics/new/_components/form-schema";
import { auth } from "@/lib/auth";
import { generateImage, getJob } from "@/lib/civitai";
import { generatePrompts } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { uploadImageToS3 } from "@/lib/s3";
import { zValidator } from "@hono/zod-validator";
import { PanelStatus } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const generateComicId = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  let isUnique = false;
  while (!isUnique) {
    result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existingComic = await prisma.comic.findUnique({
      where: { id: result },
    });
    if (!existingComic) {
      isUnique = true;
    }
  }
  return result;
};

export const comics = new Hono()
  // test-generate と test-job は開発環境のみ
  .post("/test-generate", async (c) => {
    if (process.env.NODE_ENV === "production") {
      return c.json({ error: "Not available in production" }, 403);
    }
    const result = await generateImage({
      prompt: "",
      negativePrompt: "",
      panelId: "test-panel-id",
    });
    return c.json(result);
  })
  .post("/test-job", async (c) => {
    if (process.env.NODE_ENV === "production") {
      return c.json({ error: "Not available in production" }, 403);
    }
    const { jobId } = await c.req.json();
    if (!jobId) {
      return c.json({ error: "Job ID is required" }, 400);
    }
    const result = await getJob(jobId);
    return c.json(result);
  })
  .post("/new", zValidator("json", FormSchema), async (c) => {
    const session = await auth();
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const data = await c.req.valid("json");

    const comic = await prisma.comic.create({
      data: {
        title: "New Comic",
        userId: session.user.id,
        id: await generateComicId(),
        story: data.story || null,
      },
    });

    await prisma.panel.createMany({
      data: Array.from({ length: 4 }, (_, index) => ({
        order: index,
        comicId: comic.id,
        prompt: "",
        negativePrompt: "",
        status: PanelStatus.PENDING,
      })),
    });

    try {
      await prisma.panel.updateMany({
        where: { comicId: comic.id },
        data: { status: PanelStatus.GENERATING_TAGS },
      });

      const { prompts, story } = await generatePrompts({ data, comicId: comic.id });

      // update panels with prompts
      await Promise.all(
        prompts.map(async (prompt, index) => {
          await prisma.panel.updateMany({
            where: { comicId: comic.id, order: index },
            data: {
              prompt: prompt.prompt,
              negativePrompt: prompt.negativePrompt,
              status: PanelStatus.PENDING,
            },
          });
        })
      );

      await prisma.comic.update({
        where: { id: comic.id },
        data: { story },
      });
    } catch (error) {
      console.error("Error generating prompts:", error);
      await prisma.panel.updateMany({
        where: { comicId: comic.id },
        data: { status: PanelStatus.FAILED },
      });
      return c.json({ error: "Error generating prompts" }, 500);
    }

    // start image generation in the background
    const panels = await prisma.panel.findMany({
      where: { comicId: comic.id },
    });

    panels.forEach((panel) => {
      generateImage({
        prompt: panel.prompt,
        negativePrompt: panel.negativePrompt,
        panelId: panel.id,
      }).catch(console.error);
    });

    const comicWithPanels = await prisma.comic.findUnique({
      where: { id: comic.id },
      include: { panels: true },
    });

    if (!comicWithPanels) {
      return c.json({ error: "Create Failed" }, 500);
    }

    return c.json({ status: "success", id: comicWithPanels.id });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const comic = await prisma.comic.findUnique({
      where: { id },
      include: { panels: { orderBy: { order: "asc" } } },
    });

    if (!comic) {
      return c.json({ error: "Comic not found" }, 404);
    }

    return c.json(comic);
  })
  .get("/:id/panel/:order", async (c) => {
    const id = c.req.param("id");
    const session = await auth();

    const comic = await prisma.comic.findUnique({
      where: { id, userId: session?.user?.id },
    });

    if (!comic) {
      return c.json({ error: "Comic not found" }, 404);
    }

    const order = parseInt(c.req.param("order"));

    if (isNaN(order) || order < 0 || order > 3) {
      return c.json({ error: "Invalid panel order" }, 400);
    }

    const panel = await prisma.panel.findFirst({
      where: {
        comicId: id,
        order: order,
      },
    });

    if (!panel) {
      return c.json({ error: "Panel not found" }, 404);
    }

    return c.json(panel);
  })
  // edit panel image
  .post(
    "/panel/:id",
    zValidator(
      "form",
      z.object({
        image: z.instanceof(File),
      })
    ),
    async (c) => {
      const session = await auth();
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const formData = await c.req.valid("form");
      const imageFile = formData.image as File;

      if (!imageFile) {
        return c.json({ error: "Image file is required" }, 400);
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

      const id = c.req.param("id");

      const panel = await prisma.panel.findUnique({
        where: { id, comic: { userId: session.user.id } },
      });

      if (!panel) {
        return c.json({ error: "Invalid panel" }, 400);
      }

      const s3Key = `panels/${panel.id}.png`;
      await uploadImageToS3(s3Key, imageBuffer);

      return c.json({ success: true });
    }
  )
  .post("/webhook", async (c) => {
    const data = await c.req.json();

    console.log("webhook data", data);

    if (!data.jobId) {
      console.log("No jobId");
      return c.json({ error: "Invalid webhook data" }, 400);
    }

    if (!data.jobHasCompleted) {
      console.log("No jobHasCompleted");
      return c.json({ success: true });
    }

    try {
      const panel = await prisma.panel.findFirst({
        where: { civitaiJobId: data.jobId },
      });

      if (!panel) {
        console.log("Panel not found");
        return c.json({ error: "Panel not found" }, 404);
      }

      const job = await getJob(data.jobId);

      // download image and upload to S3
      const imageResponse = await fetch(job.result.blobUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

      const s3Key = `panels/${panel.id}_original.png`;
      await uploadImageToS3(s3Key, imageBuffer);

      await prisma.panel.update({
        where: { id: panel.id },
        data: {
          status: PanelStatus.COMPLETED,
          originalKey: s3Key,
        },
      });

      return c.json({ success: true });
    } catch (error) {
      console.error("Webhook processing failed:", error);

      // if error, mark panel as failed
      if (data.jobId) {
        await prisma.panel.updateMany({
          where: { civitaiJobId: data.jobId },
          data: { status: PanelStatus.FAILED },
        });
      }

      return c.json({ error: "Webhook processing failed" }, 500);
    }
  });
