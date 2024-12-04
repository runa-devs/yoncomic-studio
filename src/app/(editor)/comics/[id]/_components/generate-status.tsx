"use client";

import { cn } from "@/lib/utils";
import { PanelStatus } from "@prisma/client";
import { CheckCircle2, Image, Loader, Loader2, Tag, XCircle } from "lucide-react";

interface GenerateStatusProps {
  status: PanelStatus;
}

const statusConfig = {
  [PanelStatus.PENDING]: {
    message: "生成待ち",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: Loader2,
  },
  [PanelStatus.GENERATING_TAGS]: {
    message: "タグを生成中",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    icon: Tag,
  },
  [PanelStatus.GENERATING_IMAGE]: {
    message: "画像を生成中",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    icon: Image,
  },
  [PanelStatus.COMPLETED]: {
    message: "生成完了",
    color: "text-green-500",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
  },
  [PanelStatus.FAILED]: {
    message: "生成失敗",
    color: "text-red-500",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
};

export function GenerateStatus({ status }: GenerateStatusProps) {
  const config = statusConfig[status];
  const isGenerating =
    status === PanelStatus.GENERATING_TAGS || status === PanelStatus.GENERATING_IMAGE;
  const isPending = status === PanelStatus.PENDING;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <div className={cn("rounded-full p-2 transition-colors duration-300", config.bgColor)}>
          <config.icon className={cn("size-5", config.color, isPending && "animate-spin")} />
        </div>
        <span className={cn("inline-flex items-center gap-2 font-medium", config.color)}>
          {config.message} {isGenerating && <Loader className="size-4 animate-spin" />}
        </span>
      </div>
    </div>
  );
}
