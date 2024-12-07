"use client";

import { bubbles } from "@/app/(editor)/comics/[id]/_components/bubbles";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToolStore } from "@/hooks/use-tool";
import { cn } from "@/lib/utils";
import { Circle, Eraser, Hand, MessageCircle, Pencil, Square, Type } from "lucide-react";

export type Tool = "pen" | "eraser" | "rectangle" | "circle" | "hand" | "text" | "bubble";

export const ToolBar = ({ className }: { className?: string }) => {
  const { currentTool, setTool, selectedBubbleId, setSelectedBubbleId } = useToolStore();

  const tools = [
    { name: "pen" as Tool, icon: Pencil },
    { name: "eraser" as Tool, icon: Eraser },
    { name: "rectangle" as Tool, icon: Square },
    { name: "circle" as Tool, icon: Circle },
    { name: "text" as Tool, icon: Type },
    { name: "hand" as Tool, icon: Hand },
  ];

  return (
    <div
      className={cn(
        "flex  flex-col gap-2 rounded-lg bg-background/80 p-2 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.name}
            variant="ghost"
            size="icon"
            onClick={() => setTool(tool.name)}
            className={cn("hover:bg-muted", currentTool === tool.name && "bg-muted")}
          >
            <Icon className="size-5" />
          </Button>
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTool("bubble")}
            className={cn("hover:bg-muted", currentTool === "bubble" && "bg-muted")}
          >
            <MessageCircle className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {bubbles.map((bubble) => (
            <DropdownMenuItem
              key={bubble.id}
              onClick={() => {
                setTool("bubble");
                setSelectedBubbleId(bubble.id);
              }}
              className={cn("flex items-center", selectedBubbleId === bubble.id && "bg-muted")}
            >
              <div className="mr-2 size-4 overflow-hidden rounded">
                <img
                  src={`/bubbles/${bubble.src}`}
                  alt={bubble.name}
                  className="size-full object-contain"
                />
              </div>
              {bubble.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
