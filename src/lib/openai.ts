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
与えられたキャラクター情報から、4コママンガの4コマ分のPositive PromptとNegative PromptをDanbooruタグまたは英語の一般名詞で生成してください
ストーリーやキャラクターの特徴が特にない場合は、その場に合う最高のタグを生成してください。
Jsonのフォーマットに従ってください。

出力フォーマット:
{
  "prompts": [
    {
      "prompt": "rating:general, masterpiece, absurdres, best quality, artist:hoshino_koucha, artist:miyasaka_naco, artist:miyasaka_miyu, (artist:ciloranko:1.1), (artist:zoirun:1.1), (artist:korie riko:1.2),BREAK, solo, [構図プロンプト], BREAK, [キャラプロンプト],",
      "negativePrompt": "(multiple_views:1.3), (2girl:1.2), (multiple girls:1.2),2boys, multiple boys, (text:1.3), (speech bubble:1.5), nail, (nsfw:1.3), lowres, bad, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, abstract, loli, 3D, nsfw, text, watermark, bad hands, extra digit,fewer digits, worst finger, ribbon, petals, ribbon background, spread ribbon,"
    }
    // ↑このフォーマットで4コマ分生成してください
  ],
  "story": "ストーリー情報(1コマずつのストーリーを生成してください)"
}

構図前のプロンプトは意味がない前提で構図プロンプトを考えてください
構図プロンプトは以下の順番とフォーマットになります
(キャラの人数:1.3), (キャラの構図:1.3), (キャラの視線:1.3), (キャラのポーズ:1.2), (キャラの表情:1.2), (背景:1.1), (オブジェクト:1.1), (その他:1.3),

必須：必ず必要なプロンプトです
任意：なくてもいいプロンプトです
選抜：選択肢の中から選んでください
参考：例を参考にしてタグや一般名詞を出力
複数：タグに個数制限はありません

＜キャラの人数＞必須・選抜
1boy：男性の場合
1girl：女性の場合
no_humans：その他の場合

＜キャラの構図＞必須・選抜
upper body：上半身プロンプト、特に条件がなければ基本これ
full_body：全身プロンプト、座るなどの全身が見えないと成立しないような内容の場合こちらを選択
portrait：首うえのみのプロンプト、顔を主張するような内容の場合選択、これ入る場合はキャラの服や首下の特徴のプロンプトを削除
cowboy shot：太ももから上を表示のプロンプト、服やポーズを主張するとき選択。

＜キャラの視線＞必須・参考
looking at viewer：読者に視線を向けているものです、基本これ
looking_back：後ろから振り向く視線
looking_to_the_side：横を見ているときの視線
looking_down up：上や下を見ているときの視線
looking_at_[object]：内容にあった対象を見ている感じ

＜キャラのポーズ（体や手）＞任意・複数・参考
ポーズが重要な内容ではない場合はプロンプトが無しでも構わない
例standing, sitting, arm_behind_back, rabbit_pose, jumping, dancing, lying, arms_up, back, wariza, sitting, heart hands, rabbit pose, holding_XXXX,

＜キャラの表情（顔・目の状況）＞任意・複数・参考
表情が重要な内容ではない場合はプロンプトが無しでも構わない
例one_eye_closed, sad, closing_eyes, Angry, embarrassed, blush,

＜背景＞必須・複数・参考
[Color]_background：その色の単色背景
simple_background：シンプルな模様
polka_dot_background：水玉模様
背景に深い意味がない場合は３つから適当に選ぶ
例
sky_background,ocean_background,European_town_background,japanese_city_backgound, Skyscraper_background,nightcity_background,indoors,cafe_background,など

＜オブジェクト＞任意・複数・参考
必要な物のタグや名詞を入れていください、またそれに関連したポーズなども、キャラのポーズに加えてください。
tree, Smartphone, donuts, など

＜その他＞
これらに当てはまらなかった名詞や状況を英語で入力してください。

キャラクタープロンプトについて
キャラ名のプロンプトで入力されたものを倍率を変えずに入れてください（状況に応じてプロンプトを削除すること）

必ず以下の点を守ってください:
1. キャラクターに一貫性があること
2. ストーリーにははっきりとした流れ(起承転結やオチ)があること
3. 過度に公序良俗に反する内容やタグを含まないでください、指示された場合は勝手に別の案にしてください。
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
