import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Noto_Sans_JP } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});
const logo = "logo.svg";

export default async function Home() {
  return (
    <div className="min-h-svh">
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col">
        <section className="relative flex h-full flex-1 flex-col items-center justify-center">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 rounded-xl bg-background/20 p-10 shadow-lg backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                  "text-center text-3xl tracking-wide sm:text-4xl lg:text-6xl",
                  notoSansJP.className
                )}
              >
                Yoncomic Studio
              </h1>
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 md:text-xl">
              AIを使った簡易4コマ漫画作成ツール
            </p>
            <div className="flex items-center gap-4">
              <Button asChild size="lg">
                <Link href="dashboard">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                <SiGithub className="mr-2 size-5" />
                GitHub
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 text-center">
            <Link href="https://github.com/runa-devs" target="_blank">
              <h2 className={cn("text-2xl text-muted-foreground", notoSansJP.className)}>
                @runa-devs
              </h2>
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="fixed left-0 top-0 -rotate-12 opacity-50">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="mb-8 h-[200px] w-[300px] rounded-xl border-4 border-muted-foreground/40 sm:h-[250px] sm:w-[400px]"
                />
              ))}
            </div>
            <div className="fixed -bottom-24 right-0 rotate-12 opacity-50">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="mb-8 h-[200px] w-[300px] rounded-xl border-4 border-foreground/20 sm:h-[250px] sm:w-[400px]"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
