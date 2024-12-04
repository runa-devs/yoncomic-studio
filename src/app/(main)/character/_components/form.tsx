"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  charactername: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().min(1, "最低１文字以上で入力してください")
  ),
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

export function Characterform() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submitted data:", data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-2/3 rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-xl underline underline-offset-4">キャラクタープロファイル作成</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="charactername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>キャラクター名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="キャラクター名を入力" />
                  </FormControl>
                  <FormDescription>作成するキャラクター名を入力してください.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性別</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="man">男性</SelectItem>
                      <SelectItem value="woman">女性</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>作成するキャラクターの性別を選択してください.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hair_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>髪の色</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="髪の色を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "white_hair", label: "白", color: "bg-white" },
                          { value: "black_hair", label: "黒", color: "bg-black" },
                          { value: "grey_hair", label: "灰色", color: "bg-gray-500" },
                          { value: "red_hair", label: "赤", color: "bg-red-500" },
                          { value: "orange_hair", label: "オレンジ", color: "bg-orange-500" },
                          { value: "blonde_hair", label: "金髪", color: "bg-yellow-500" },
                          { value: "green_hair", label: "緑", color: "bg-green-500" },
                          { value: "aqua_hair", label: "アクア", color: "bg-blue-300" },
                          { value: "blue_hair", label: "青", color: "bg-blue-500" },
                          { value: "dark_blue_hair", label: "ダークブルー", color: "bg-blue-800" },
                          { value: "light_blue_hair", label: "ライトブルー", color: "bg-blue-300" },
                          { value: "purple_hair", label: "紫", color: "bg-purple-500" },
                          { value: "brown_hair", label: "茶色", color: "bg-yellow-800" },
                          {
                            value: "light_brown_hair",
                            label: "ライトブラウン",
                            color: "bg-yellow-300",
                          },
                          { value: "pink_hair", label: "ピンク", color: "bg-pink-500" },
                        ].map(({ value, label, color }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              <div className={`size-4 rounded-full ${color} mr-2`} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターの髪の色を選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hair_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>髪の長さ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="髪の長さを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="very_short_hair">非常に短い</SelectItem>
                        <SelectItem value="short_hair">短い</SelectItem>
                        <SelectItem value="medium_hair">中くらい</SelectItem>
                        <SelectItem value="long_hair">長い</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターの髪の長さを選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hair_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ヘアスタイル</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ヘアスタイルを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bob_cut">ボブカット</SelectItem>
                        <SelectItem value="twintails">ツインテール</SelectItem>
                        <SelectItem value="low_twintails">ロウツインテール</SelectItem>
                        <SelectItem value="side_ponytail">サイドポニーテール</SelectItem>
                        <SelectItem value="ponytail">ポニーテール</SelectItem>
                        <SelectItem value="one_side_up">片側アップ</SelectItem>
                        <SelectItem value="two_side_up">両側アップ</SelectItem>
                        <SelectItem value="wavy_hair">ウェーブヘア</SelectItem>
                        <SelectItem value="drill_hair">ドリルヘア</SelectItem>
                        <SelectItem value="hime_cut">姫カット</SelectItem>
                        <SelectItem value="messy_hair">乱れた髪</SelectItem>
                        <SelectItem value="straight_hair">ストレートヘア</SelectItem>
                        <SelectItem value="curly_hair">カールヘア</SelectItem>
                        <SelectItem value="pixie_cut">ピクシーカット</SelectItem>
                        <SelectItem value="single_braid">一つ編み</SelectItem>
                        <SelectItem value="twin_braids">二つ編み</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターのヘアスタイルを選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eye_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目の色</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="目の色を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "aqua_eyes", label: "アクア", color: "bg-blue-300" },
                          { value: "black_eyes", label: "黒", color: "bg-black" },
                          { value: "blue_eyes", label: "青", color: "bg-blue-500" },
                          { value: "brown_eyes", label: "茶色", color: "bg-yellow-800" },
                          { value: "green_eyes", label: "緑", color: "bg-green-500" },
                          { value: "grey_eyes", label: "灰色", color: "bg-gray-500" },
                          { value: "orange_eyes", label: "オレンジ", color: "bg-orange-500" },
                          { value: "purple_eyes", label: "紫", color: "bg-purple-500" },
                          { value: "pink_eyes", label: "ピンク", color: "bg-pink-500" },
                          { value: "red_eyes", label: "赤", color: "bg-red-500" },
                          { value: "white_eyes", label: "白", color: "bg-white" },
                          { value: "yellow_eyes", label: "黄色", color: "bg-yellow-500" },
                        ].map(({ value, label, color }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              <div className={`size-4 rounded-full ${color} mr-2`} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターの目の色を選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bust_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>胸の大きさ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="胸の大きさを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flat_chest">フラット</SelectItem>
                        <SelectItem value="small_breasts">小さい</SelectItem>
                        <SelectItem value="medium_breasts">中くらい</SelectItem>
                        <SelectItem value="large_breasts">大きい</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターの胸の大きさを選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clothes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>服装</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="服装を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blouse">ブラウス</SelectItem>
                        <SelectItem value="dress">ドレス</SelectItem>
                        <SelectItem value="miko">巫女</SelectItem>
                        <SelectItem value="white_shirt">白シャツ</SelectItem>
                        <SelectItem value="serafuku">セーラー服</SelectItem>
                        <SelectItem value="maid">メイド服</SelectItem>
                        <SelectItem value="school_uniform">制服</SelectItem>
                        <SelectItem value="camisole">キャミソール</SelectItem>
                        <SelectItem value="bikini">ビキニ</SelectItem>
                        <SelectItem value="jacket">ジャケット</SelectItem>
                        <SelectItem value="coat">コート</SelectItem>
                        <SelectItem value="santa_dress">サンタドレス</SelectItem>
                        <SelectItem value="suit">スーツ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>作成するキャラクターの服装を選択してください.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>アクセサリー</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="アクセサリーを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cat_ears">猫耳</SelectItem>
                        <SelectItem value="horse_ears">馬耳</SelectItem>
                        <SelectItem value="rabbit_ears">ウサギ耳</SelectItem>
                        <SelectItem value="tail">尻尾</SelectItem>
                        <SelectItem value="straw_hat">麦わら帽子</SelectItem>
                        <SelectItem value="glasses">眼鏡</SelectItem>
                        <SelectItem value="sunglasses">サングラス</SelectItem>
                        <SelectItem value="party_hat">パーティーハット</SelectItem>
                        <SelectItem value="halo">光輪</SelectItem>
                        <SelectItem value="hair_bow">髪飾り</SelectItem>
                        <SelectItem value="hair_ornament">髪の装飾</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      作成するキャラクターのアクセサリーを選択してください.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>色</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="色を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "white_", label: "白", color: "bg-white" },
                          { value: "black_", label: "黒", color: "bg-black" },
                          { value: "grey_", label: "灰色", color: "bg-gray-500" },
                          { value: "red_", label: "赤", color: "bg-red-500" },
                          { value: "orange_", label: "オレンジ", color: "bg-orange-500" },
                          { value: "yellow_", label: "黄色", color: "bg-yellow-500" },
                          { value: "green", label: "緑", color: "bg-green-500" },
                          { value: "blue", label: "青", color: "bg-blue-500" },
                          { value: "dark_blue_", label: "ダークブルー", color: "bg-blue-800" },
                          { value: "light_blue_", label: "ライトブル", color: "bg-blue-300" },
                          { value: "purple", label: "紫", color: "bg-purple-500" },
                          { value: "brown", label: "茶色", color: "bg-yellow-800" },
                          { value: "light_brown", label: "ライトブラウン", color: "bg-yellow-300" },
                          { value: "pink", label: "ピンク", color: "bg-pink-500" },
                        ].map(({ value, label, color }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              <div className={`size-4 rounded-full ${color} mr-2`} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>作成するキャラクターの色を選択してください.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
