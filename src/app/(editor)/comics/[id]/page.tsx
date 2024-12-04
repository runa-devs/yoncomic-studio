"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";
import { PanelStatus } from "@prisma/client";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { GenerateStatus } from "./_components/generate-status";

const fetcher = async ([url, id]: [string, string]) => {
  const res = await client.api.comics[":id"].$get({ param: { id } });
  return res.json();
};

export default function ComicPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(["/api/comics", params.id], fetcher);

  if (isLoading || data == undefined) {
    return (
      <div className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">コミックを読み込み中...</p>
      </div>
    );
  }

  if ("error" in data) {
    return (
      <div className="container mx-auto flex h-[calc(100svh-5rem)] max-w-2xl flex-col px-4 py-8 md:justify-center">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>エラーが発生しました</AlertTitle>
          <AlertDescription>{data.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isReady = (data.panels ?? []).every((panel) => panel.status === PanelStatus.COMPLETED);

  if (!isReady) {
    return (
      <div className="container mx-auto flex h-[calc(100svh-5rem)] max-w-2xl flex-col px-4 py-8 md:justify-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">マンガは生成中です...</h1>
            <p className="text-muted-foreground">
              マンガの生成が完了するまでしばらくお待ちください。
            </p>
          </div>
          <div className="grid gap-4">
            {data.panels.map((panel, index) => (
              <div
                key={panel.id}
                className={cn(
                  "rounded-lg border p-4",
                  panel.status === PanelStatus.COMPLETED && "bg-muted/50"
                )}
              >
                <div className="mb-2 font-medium">コマ {index + 1}</div>
                <GenerateStatus status={panel.status} />
              </div>
            ))}
          </div>
          {data.panels.some((panel) => panel.status === PanelStatus.FAILED) && (
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={"/comics/new"}>やり直す</Link>
              </Button>
              <p className="text-muted-foreground">
                生成に失敗しました。お手数ですが、最初からやり直してください。
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">生成されたコミック</h1>
        <div className="grid gap-4">
          {data.panels.map((panel, index) => (
            <div key={panel.id} className="aspect-[16/9] rounded-lg border bg-muted"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
