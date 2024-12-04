import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const mplus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400"],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Yoncomic Studio",
  description: "AIを使った簡易4コマ漫画作成ツール",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo_dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <SessionProvider>
        <body className={cn("flex min-h-svh flex-col", mplus.className, notoSansJP.className)}>
          <main className="flex flex-1 flex-col">{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
