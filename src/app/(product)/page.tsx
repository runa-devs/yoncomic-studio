import { ClientSignInButton } from "@/components/auth/signin-button-client";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { mplus, notoSansJP } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";

const logo = "logo.svg";

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-svh">
      <Header />
      <main className={cn("flex flex-col", mplus.className)}>
        <section className="relative flex h-[calc(100vh-4rem)] flex-col  items-center justify-center">
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
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
                AI
              </span>
              を使った簡易4コマ漫画作成ツール
            </p>
            <div className="flex items-center gap-4">
              {session ? (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
                  size="lg"
                  asChild
                >
                  <Link href="/comics/new">はじめる</Link>
                </Button>
              ) : (
                <ClientSignInButton
                  redirectTo="/comics/new"
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
                >
                  はじめる
                </ClientSignInButton>
              )}
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

        <section className="relative w-full bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className={cn("mb-12 text-center text-3xl md:text-4xl", notoSansJP.className)}>
              簡単4ステップで4コマ漫画が完成
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: (
                    <>
                      1.
                      <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text font-bold text-transparent">
                        アイデア
                      </span>
                      を入力
                    </>
                  ),
                  description: "わからないところはAIが考えてくれます",
                  alt: "アイデア入力画面",
                },
                {
                  title: (
                    <>
                      2.
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
                        AI
                      </span>
                      が展開を考える
                    </>
                  ),
                  description: "AIが自動で4コマの展開を考えます",
                  alt: "展開考える画面",
                },
                {
                  title: <>3. 画像を生成</>,
                  description: "高品質な画像をAIが自動生成",
                  alt: "画像生成画面",
                },
                {
                  title: "4. 完成！",
                  description: "オリジナルの4コマ漫画の出来上がり",
                  alt: "完成画面",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-lg"
                >
                  <Skeleton className="h-[200px] w-full rounded-lg">{feature.alt}</Skeleton>
                  <h3 className={cn("text-xl font-medium", notoSansJP.className)}>
                    {feature.title}
                  </h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
