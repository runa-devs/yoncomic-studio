"use client";
import { CenterTab } from "@/app/(editor)/comics/[id]/_components/centertab";
import { ToolBar } from "@/app/(editor)/comics/[id]/_components/tool-bar";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";
import { Comic, Panel } from "@prisma/client";
import { LayoutGrid, LayoutPanelTop, Rows, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ImageEditorRef } from "./ImageEditor";
import ImageEditor from "./ImageEditor";

type GenuiProps = {
  comicData: Comic & { panels: Panel[]; createdAt: string };
};

type ViewMode = "grid" | "vertical" | "single";

export const Genui = ({ comicData }: GenuiProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCell, setSelectedCell] = useState(-1);
  const imageEditorRefs = useRef<(ImageEditorRef | null)[]>([]);

  const commonStyles = {
    single:
      "aspect-[3/2] w-[700px] rounded-sm border-2 border-gray-300 bg-white items-center flex justify-center",
  };

  useEffect(() => {
    imageEditorRefs.current = Array(comicData.panels.length).fill(null);
  }, [comicData.panels.length]);

  const handlePanelClick = (index: number) => {
    const container = document.getElementById(`panel-${index}`);
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleScroll = (scrollTop: number) => {
    setScrollPosition(scrollTop);
  };

  const toggleViewMode = () => {
    setViewMode((current) => {
      switch (current) {
        case "single":
          return "grid";
        case "grid":
          return "vertical";
        case "vertical":
          return "single";
      }
    });
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case "single":
        return <LayoutGrid className="size-4" />;
      case "grid":
        return <Rows className="size-4" />;
      case "vertical":
        return <LayoutPanelTop className="size-4" />;
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        imageEditorRefs.current.map(async (ref, index) => {
          if (!ref) return;

          const formData = await ref.getImageFormData();
          if (!formData) return;

          const response = await client.api.comics.panel[":id"].$post({
            param: {
              id: comicData.panels[index].id,
            },
            form: {
              image: formData.get("image") as File,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to upload image for panel ${index}`);
          }

          const result = await response.json();
          console.log(`Upload successful for panel ${index}:`, result);
        })
      );
    } catch (error) {
      console.error("Failed to save images:", error);
    }
  };

  return (
    <div className="relative flex flex-1">
      <ToolBar
        className={cn(
          "fixed right-4 top-1/3 -translate-y-1/2 transition-all duration-300",
          "flex flex-col gap-2 rounded-xl border bg-white/80 p-2 shadow-sm backdrop-blur-sm",
          `translate-y-[${scrollPosition}px]`
        )}
      />

      <section
        className={cn(
          "fixed z-50 rounded-xl border bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-all duration-300",
          "top-1/3 -translate-y-1/2",
          `translate-y-[${scrollPosition}px]`,
          "left-4"
        )}
      >
        <div className="flex flex-col gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 font-medium hover:bg-gray-100/80"
            onClick={toggleViewMode}
          >
            {getViewModeIcon()}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 font-medium hover:bg-gray-100/80"
            onClick={handleSave}
          >
            <Save className="size-4" />
          </Button>
          <div className="h-px bg-gray-200" />
          {comicData.panels.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="size-9 font-medium hover:bg-gray-100/80"
              onClick={() => handlePanelClick(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </section>

      <div className="flex flex-1">
        {/* グリッド表示 */}
        <div
          className={cn(
            "flex size-full items-center justify-center",
            viewMode !== "grid" && "hidden"
          )}
        >
          <CenterTab
            comicData={comicData}
            selectedCell={selectedCell}
            onScroll={handleScroll}
            refs={imageEditorRefs}
          />
        </div>

        {/* 垂直表示 */}
        <div
          className={cn(
            "flex size-full items-center justify-center",
            viewMode !== "vertical" && "hidden"
          )}
        >
          <div className="flex flex-col gap-1">
            {comicData.panels.map((panel, index) => (
              <div
                key={index}
                className="group relative aspect-[3/2] w-[320px] overflow-hidden rounded-md border bg-white shadow-sm transition-all hover:shadow-md"
              >
                {panel.key || panel.originalKey ? (
                  <div className="relative size-full">
                    <ImageEditor
                      comicId={comicData.id}
                      imageUrl={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${
                        panel.key ?? panel.originalKey
                      }`}
                      width={320}
                      height={213}
                      ref={(el) => {
                        imageEditorRefs.current[index] = el;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex size-full items-center justify-center text-2xl text-gray-300">
                    {index + 1}
                  </div>
                )}
                <div className="absolute left-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-white/80 text-xs font-medium shadow-sm backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* シングル表示 */}
        <div className={cn("flex flex-1", viewMode !== "single" && "hidden")}>
          <div className="flex size-full items-center justify-center">
            <section className={commonStyles.single}>
              {selectedCell !== -1 && comicData.panels[selectedCell] && (
                <ImageEditor
                  comicId={comicData.id}
                  imageUrl={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${
                    comicData.panels[selectedCell].key ?? comicData.panels[selectedCell].originalKey
                  }`}
                  width={700}
                  height={467}
                  ref={(el) => {
                    imageEditorRefs.current[selectedCell] = el;
                  }}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
