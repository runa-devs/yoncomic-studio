import { auth } from "@/lib/auth";
import { generateImage, getJob, testPrompts } from "@/lib/civitai";
import { prisma } from "@/lib/prisma";
import { uploadImageToS3 } from "@/lib/s3";
import { PanelStatus } from "@prisma/client";
import { Hono } from "hono";

export const comics = new Hono()
  .post("/test-generate", async (c) => {
    const result = await generateImage({
      prompt: "",
      negativePrompt: "",
      panelId: "test-panel-id",
    });
    return c.json(result);
  })
  .post("/test-job", async (c) => {
    const { jobId } = await c.req.json();
    if (!jobId) {
      return c.json({ error: "Job ID is required" }, 400);
    }
    const result = await getJob(jobId);
    return c.json(result);
  })
  .post("/new", async (c) => {
    const session = await auth();
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const comic = await prisma.comic.create({
      data: {
        title: "New Comic",
        userId: session.user.id,
      },
    });

    // generate danbooru tags for each panel
    // TODO: generate tags with OpenAI Chat Completion API
    // const prompts = [testPrompts, testPrompts, testPrompts, testPrompts];

    // if (prompts.length !== 4) {
    //   return c.json({ error: "Invalid number of panels" }, 400);
    // }

    const prompts = [testPrompts];

    // create panels
    await prisma.panel.createMany({
      data: prompts.map((prompt, index) => ({
        order: index,
        comicId: comic.id,
        prompt: prompt.prompt,
        negativePrompt: prompt.negativePrompt,
        status: PanelStatus.PENDING,
      })),
    });

    const createdPanels = await prisma.panel.findMany({
      where: { comicId: comic.id },
    });

    // start image generation in the background
    createdPanels.forEach((panel) => {
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

    return c.json(comicWithPanels);
  })
  // get comic by id
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const comic = await prisma.comic.findUnique({
      where: { id },
      include: { panels: true },
    });

    if (!comic) {
      return c.json({ error: "Comic not found" }, 404);
    }

    return c.json(comic);
  })
  // get panel by order
  .get("/:id/panel/:order", async (c) => {
    const id = c.req.param("id");
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
  .post("/:id/panel/:order", async (c) => {
    const user = await auth();
    if (!user?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const order = parseInt(c.req.param("order"));

    if (isNaN(order) || order < 0 || order > 3) {
      return c.json({ error: "Invalid panel order" }, 400);
    }

    const comic = await prisma.comic.findUnique({
      where: { id },
    });

    if (!comic || comic.userId !== user.user.id) {
      return c.json({ error: "Not found" }, 404);
    }

    const data = await c.req.json();
    // TODO: 実際のパネル編集ロジックを実装

    return c.json({ success: true });
  })
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
