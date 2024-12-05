export const hairColors = [
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
  { value: "light_brown_hair", label: "ライトブラウン", color: "bg-yellow-300" },
  { value: "pink_hair", label: "ピンク", color: "bg-pink-500" },
] as const;

export const eyeColors = [
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
] as const;

export const clothesOptions = [
  { value: "blouse", label: "ブラウス" },
  { value: "dress", label: "ドレス" },
  { value: "miko", label: "巫女" },
  { value: "white_shirt", label: "白シャツ" },
  { value: "serafuku", label: "セーラー服" },
  { value: "maid", label: "メイド服" },
  { value: "school_uniform", label: "制服" },
  { value: "camisole", label: "キャミソール" },
  { value: "bikini", label: "ビキニ" },
  { value: "jacket", label: "ジャケット" },
  { value: "coat", label: "コート" },
  { value: "santa_dress", label: "サンタドレス" },
  { value: "suit", label: "スーツ" },
] as const;

export const accessoryOptions = [
  { value: "cat_ears", label: "猫耳" },
  { value: "horse_ears", label: "馬耳" },
  { value: "rabbit_ears", label: "ウサギ耳" },
  { value: "tail", label: "尻尾" },
  { value: "straw_hat", label: "麦わら帽子" },
  { value: "glasses", label: "眼鏡" },
  { value: "sunglasses", label: "サングラス" },
  { value: "party_hat", label: "パーティーハット" },
  { value: "halo", label: "輪" },
  { value: "hair_bow", label: "髪飾り" },
  { value: "hair_ornament", label: "髪の装飾" },
] as const;

export const colorOptions = [
  { value: "white_", label: "白", color: "bg-white" },
  { value: "black_", label: "黒", color: "bg-black" },
  { value: "grey_", label: "灰色", color: "bg-gray-500" },
  { value: "red_", label: "赤", color: "bg-red-500" },
  { value: "orange_", label: "オレンジ", color: "bg-orange-500" },
  { value: "yellow_", label: "黄色", color: "bg-yellow-500" },
  { value: "green", label: "緑", color: "bg-green-500" },
  { value: "blue", label: "青", color: "bg-blue-500" },
  { value: "dark_blue_", label: "ダークブルー", color: "bg-blue-800" },
  { value: "light_blue_", label: "ライトブルー", color: "bg-blue-300" },
  { value: "purple", label: "紫", color: "bg-purple-500" },
  { value: "brown", label: "茶色", color: "bg-yellow-800" },
  { value: "light_brown", label: "ライトブラウン", color: "bg-yellow-300" },
  { value: "pink", label: "ピンク", color: "bg-pink-500" },
] as const;

export const hairLengthOptions = [
  { value: "very_short_hair", label: "非常に短い" },
  { value: "short_hair", label: "短い" },
  { value: "medium_hair", label: "中くらい" },
  { value: "long_hair", label: "長い" },
] as const;

export const hairStyleOptions = [
  { value: "bob_cut", label: "ボブカット" },
  { value: "twintails", label: "ツインテール" },
  { value: "low_twintails", label: "ロウツインテール" },
  { value: "side_ponytail", label: "サイドポニーテール" },
  { value: "ponytail", label: "ポニーテール" },
  { value: "one_side_up", label: "片側アップ" },
  { value: "two_side_up", label: "両側アップ" },
  { value: "wavy_hair", label: "ウェーブヘア" },
  { value: "drill_hair", label: "ドリルヘア" },
  { value: "hime_cut", label: "姫カット" },
  { value: "messy_hair", label: "乱れた髪" },
  { value: "straight_hair", label: "ストレートヘア" },
  { value: "curly_hair", label: "カールヘア" },
  { value: "pixie_cut", label: "ピクシーカット" },
  { value: "single_braid", label: "一つ編み" },
  { value: "twin_braids", label: "二つ編み" },
] as const;

export const bustSizeOptions = [
  { value: "flat_chest", label: "フラット" },
  { value: "small_breasts", label: "小さい" },
  { value: "medium_breasts", label: "中くらい" },
  { value: "large_breasts", label: "大きい" },
] as const;
