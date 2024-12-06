import { ClientSignInButton } from "@/components/auth/signin-button-client";
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
                redirect="/comics/new"
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
              >
                はじめる
              </ClientSignInButton>
            )}
            <Button variant="outline" size="lg" className={notoSansJP.className}>
              <SiGithub className="mr-2 size-5" />
              GitHub
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            本サービスの利用には、
            <Link href="/terms" className="underline">
              利用規約
            </Link>
            への同意が必要です。
            <br />
            ログインすることで、規約に同意したものとみなします。
          </p>
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

      <section className="relative w-full bg-muted py-24">
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
                <h3 className={cn("text-xl font-medium", notoSansJP.className)}>{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-24">
            <h2 className={cn("mb-12 text-center text-3xl md:text-4xl", notoSansJP.className)}>
              Yoncomic Studioの特徴
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "直感的な操作性",
                  description:
                    "専門的な知識がなくても、誰でも簡単に4コマ漫画を作成できます。AIがあなたの創作をサポートします。",
                  icon: "🎨",
                },
                {
                  title: "高品質な画像生成",
                  description:
                    "最新の画像生成モデルを活用し、プロフェッショナルな品質の画像を自動生成。アイデアを忠実に再現します。",
                  icon: "✨",
                },
                {
                  title: "時間と手間を大幅削減",
                  description:
                    "従来の漫画制作にかかる時間を大幅に短縮。アイデアさえあれば、数分で4コマ漫画が完成します。",
                  icon: "⚡",
                },
                {
                  title: "作品の共有と保存",
                  description:
                    "作成した4コマ漫画はクラウドに保存され、SNSでの共有も簡単。あなたの作品を世界中に発信できます。",
                  icon: "🌐",
                },
                {
                  title: "アイデアのサポート",
                  description:
                    "「何を描こうか」で悩んだ時も、AIがストーリーのアイデアを提案。創作の幅が大きく広がります。",
                  icon: "💡",
                },
                {
                  title: "無料で使える",
                  description:
                    "完全無料で利用可能(期間限定)。気軽に創作を始められ、本格的な制作にも対応できます。",
                  icon: "🎁",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-4 rounded-lg bg-background p-6 shadow-lg transition-all hover:scale-105"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className={cn("text-xl font-medium", notoSansJP.className)}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className={cn("mb-8 text-xl text-muted-foreground", notoSansJP.className)}>
              さあ、あなたも4コマ漫画クリエイターに
            </p>
            {session ? (
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
                size="lg"
                asChild
              >
                <Link href="/comics/new">今すぐ始める</Link>
              </Button>
            ) : (
              <ClientSignInButton
                redirect="/comics/new"
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
              >
                今すぐ始める
              </ClientSignInButton>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
