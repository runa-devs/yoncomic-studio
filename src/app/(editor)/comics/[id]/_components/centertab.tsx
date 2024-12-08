"use client";
import ImageEditor from "@/app/(editor)/comics/[id]/_components/ImageEditor";
import { Comic, Panel } from "@prisma/client";
import React, { useRef } from "react";
import { ImageEditorRef } from "./ImageEditor";

type CenterTabProps = {
  comicData: Comic & { panels: Panel[] };
  selectedCell: number;
  onScroll?: (scrollTop: number) => void;
  refs: React.MutableRefObject<(ImageEditorRef | null)[]>;
};

export const CenterTab = ({ comicData, selectedCell, onScroll, refs }: CenterTabProps) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) {
      onScroll(e.currentTarget.scrollTop);
    }
  };

  const commonStyles = {
    single:
      "aspect-[3/2] w-[700px] rounded-sm border-2 border-gray-300 bg-white items-center flex justify-center",
    grid: "grid grid-cols-1 gap-4 p-4 max-h-full overflow-y-auto",
    gridCell:
      "flex aspect-[3/2] w-[500px] items-center justify-center bg-white rounded-sm border-2 border-gray-300",
  };

  return (
    <div className="flex-1 border-b">
      <div className="size-full border-b bg-gray-100">
        <div className="flex size-full items-center justify-center rounded-lg bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] p-4 [background-size:16px_16px]">
          <div ref={gridContainerRef} className={commonStyles.grid} onScroll={handleScroll}>
            {comicData.panels.map((panel, index) => (
              <section key={index} className={commonStyles.gridCell} id={`panel-${index}`}>
                {panel.key || panel.originalKey ? (
                  <ImageEditor
                    comicId={comicData.id}
                    story={comicData.story ?? undefined}
                    imageUrl={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${
                      panel.key ?? panel.originalKey
                    }`}
                    width={500}
                    height={333}
                    ref={(el) => {
                      refs.current[index] = el;
                    }}
                  />
                ) : (
                  <div className="text-[80px] text-gray-400">{index + 1}</div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CenterTab.displayName = "CenterTab";
