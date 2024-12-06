import { notoSansJP } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

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
        <body className={cn("flex min-h-svh flex-col", notoSansJP.className)}>
          <main className="flex flex-1 flex-col">{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
