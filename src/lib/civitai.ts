import { prisma } from "@/lib/prisma";
import { PanelStatus } from "@prisma/client";
import { Civitai, Scheduler } from "civitai";

const civitai = new Civitai({
  auth: process.env.CIVITAI_API_KEY!,
  env: "production",
});

export const testPrompts = {
  prompt:
    "rating:general, masterpiece, absurdres, best quality, artist:hoshino_koucha, artist:miyasaka_naco, artist:miyasaka_miyu, (artist:ciloranko:1.1), (artist:zoirun:1.1), (artist:korie riko:1.2),BREAK (1girl:1.3), (solo:1.3), (upper body:1.5), looking at viewer,  (polka_dot_background:1.3), standing, BREAK pink hair, short hair, curly_hair, purple eyes, height:158cm, medium_breasts, serafuku, navy_clothes, white_collar, red_bowtie, hairclip",
  negativePrompt:
    "(multiple_views:1.3), (2girl:1.2), (multiple girls:1.2), text, speech bubble, nail, nsfw, lowres, bad, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, abstract, loli, 3D, nsfw, text, watermark, bad hands, extra digit,fewer digits, worst finger, ribbon, petals",
};

export async function getJob(jobId: string) {
  const result = await civitai.jobs.getById(jobId);
  return result;
}

export async function generateImage(params: {
  prompt: string;
  negativePrompt: string;
  panelId: string;
}) {
  const panel = await prisma.panel.findUnique({
    where: { id: params.panelId },
  });

  if (!panel) {
    throw new Error("Panel not found");
  }

  const input = {
    model: "urn:air:sdxl:checkpoint:civitai:833294@1022833",
    params: {
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      scheduler: Scheduler.EULER_A,
      steps: 20,
      cfgScale: 6.5,
      width: 1216,
      height: 832,
      clipSkip: 2,
    },
    callbackUrl: `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/comics/webhook`,
  };

  try {
    console.log("Generating image...");
    const result = await civitai.image.fromText(input);

    await prisma.panel.update({
      where: { id: params.panelId },
      data: {
        civitaiJobId: result.jobs[0].jobId,
        status: PanelStatus.GENERATING_IMAGE,
      },
    });

    return result;
  } catch (error) {
    console.error("Image generation failed:", error);
    return error;
  }
}
