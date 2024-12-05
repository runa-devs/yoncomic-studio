import { z } from "zod";

export const characterSchema = z.object({
  charactername: z.string({
    required_error: "最低１文字以上で入力してください",
  }),
  gender: z.string({
    required_error: "選択してください",
  }),
  hair_color: z.string().optional(),
  hair_length: z.string().optional(),
  hair_style: z.string().optional(),
  eye_color: z.string().optional(),
  bust_size: z.string().optional(),
  clothes: z.string().optional(),
  accessory: z.string().optional(),
  colors: z.string().optional(),
});

export const FormSchema = z.object({
  characters: z.array(characterSchema).max(2, "キャラクターは最大2人まで設定できます"),
  story: z.string().optional(),
});

export type CharacterFormValues = z.infer<typeof characterSchema>;
export type FormValues = z.infer<typeof FormSchema>;
