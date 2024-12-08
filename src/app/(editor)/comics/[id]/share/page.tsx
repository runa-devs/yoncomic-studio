import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShareButtons } from "./_components/share-buttons";

const getComicById = async (id: string) => {
  const comic = await prisma.comic.findUnique({
    where: { id },
    include: {
      panels: true,
    },
  });

  return comic;
};

export default async function SharePage({ params }: { params: { id: string } }) {
  const comic = await getComicById(params.id);

  if (!comic) {
    redirect("/");
  }

  return (
    <div className="relative mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col items-center gap-2 border p-2 shadow-sm">
            {comic.panels.map((panel, index) => (
              <Image
                src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${panel.key ?? panel.originalKey}`}
                key={panel.id}
                alt={`漫画の${index + 1}コマ目`}
                className="w-full"
                width={600}
                height={600}
              />
            ))}
          </div>

          <div className="mt-12 rounded-lg border bg-card p-6 text-center">
            <h2 className="mb-3 text-2xl font-semibold">あなたも漫画を作ってみませんか？</h2>
            <p className="mb-4 text-muted-foreground">
              AIを使って簡単に自分だけの漫画を作成できます。 数クリックで素敵な作品が完成！
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-in-out hover:scale-105 hover:shadow-xl"
            >
              <Link href="/">今すぐ始める</Link>
            </Button>
          </div>
        </div>

        <div>
          <ShareButtons comicId={params.id} />
        </div>
      </div>
    </div>
  );
}
