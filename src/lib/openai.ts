import { FormValues } from "@/app/(editor)/comics/new/_components/form-schema";
import { prisma } from "@/lib/prisma";
import { PanelStatus } from "@prisma/client";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI();

const outputSchema = z.object({
  prompts: z.array(
    z.object({
      prompt: z.string(),
      negativePrompt: z.string(),
    })
  ),
  story: z.string(),
});

const systemPrompt = `あなたはDanbooruタグの専門家です。
Take a deep breath and think step by step.
与えられたキャラクター情報から、4コママンガの4コマ分のPositive Prompt/Negative PromptをDanbooruタグで生成してください。
ストーリーやキャラクターの特徴が特にない場合は、その場に合う最高のタグを生成してください。
Jsonのフォーマットに従ってください。

出力フォーマット:
{
  "prompts": [
    {
      "prompt": "rating:general, masterpiece, absurdres, best_quality, [アーティストタグ], [キャラクター詳細タグ]",
      "negativePrompt": "nsfw, lowres, bad_anatomy, bad_hands, text, error, missing_fingers, extra_digit, fewer_digits, cropped, worst_quality, low_quality, normal_quality, jpeg_artifacts, signature, watermark, username, blurry"
    }
    // ↑このフォーマットで4コマ分生成してください
  ],
  "story": "ストーリー情報(1コマずつのストーリーを生成してください)"
}

アーティストタグの例(あくまで例です、他のタグも同様に使用されるべきです):
- artist:hoshino_koucha
- artist:miyasaka_naco
- artist:miyasaka_miyu
- artist:ciloranko
- artist:zoirun
- artist:korie_riko

必ず以下の要素を含めてください：
1. 基本的な品質タグ（masterpiece, absurdres, best quality）
2. キャラクターの特徴を示すタグ（髪、目、服装など）
3. 適切なアーティストタグを3-4個（重みづけ1.1-1.3で）
4. シーンの状況を示すタグ（構図、背景など）

必ず以下の点を守ってください:
1. キャラクターに一貫性があること
2. ストーリーにははっきりとした流れ(起承転結やオチ)があること
3. 画風(Artist Tag)が統一されていること
4. 余計なテキストが生成されるタグは避けること
`;

export const generatePrompts = async (params: { data: FormValues; comicId: string }) => {
  await prisma.panel.updateMany({
    where: { comicId: params.comicId },
    data: { status: PanelStatus.GENERATING_TAGS },
  });

  const userPrompt = `以下のキャラクター情報からプロンプトを生成してください：
${JSON.stringify(params.data.characters, null, 2)}

ストーリー/シーン情報：
${params.data.story || "特になし(起承転結の順でオチがつくように起承転結で考えてください)"}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  try {
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const parsed = outputSchema.parse(result);
    return parsed.prompts;
  } catch (error) {
    await prisma.panel.updateMany({
      where: { comicId: params.comicId },
      data: { status: PanelStatus.FAILED },
    });
    console.error("プロンプトの生成に失敗しました:", error);
    throw new Error("プロンプトの生成に失敗しました");
  }
};
