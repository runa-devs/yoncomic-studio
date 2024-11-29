import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Noto_Sans_JP } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { DiGithubBadge } from "react-icons/di";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});
const logo = "logo.svg";

export default async function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative flex min-h-svh flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center space-y-2">
            <div className="flex justify-center">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                draggable={false}
                className="grow-0 select-none"
              />
              <h1
                className={cn(
                  "ml-5 line-clamp-2 justify-center self-center text-3xl tracking-wide sm:text-4xl  lg:text-6xl",
                  notoSansJP.className
                )}
              >
                Yoncomic Studio
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl">
              AIを使った簡易4コマ漫画作成ツール
            </p>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="dashboard">Get Started</Link>
              </Button>
              <Button variant="outline">
                GitHub
                <DiGithubBadge className="size-6" />
              </Button>
            </div>

            <h1 className={cn("absolute bottom-40 text-4xl", notoSansJP.className)}>@runa-devs</h1>
          </div>
          <div className="-z-50">
            <div className="fixed left-20 top-0 -rotate-12 grid-cols-2 overflow-hidden">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="mb-8 flex h-[250px] w-[400px] items-center space-x-4 rounded-xl border-4 border-muted"
                />
              ))}
            </div>
            <div className="fixed -bottom-24 right-10 hidden rotate-12 grid-cols-2 overflow-hidden md:block">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="mb-8 flex h-[250px] w-[400px] items-center space-x-4 rounded-xl border-4 border-foreground/20"
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-100 py-6 dark:bg-gray-800">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-left">
              © 2023 Acme Inc. All rights reserved.
            </p>
            <nav className="flex items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
