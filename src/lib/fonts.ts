import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";

export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const mplus = localFont({
  src: "./MPLUSRounded1c-Regular.ttf",
  display: "swap",
});
