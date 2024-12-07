"use client";
import ImageEditor from "@/app/(editor)/comics/[id]/_components/ImageEditor";
import { Comic } from "./genui";

type CenterTabProps = {
  comicData: Comic;
  selectedCell: number;
};

export const CenterTab = ({ comicData, selectedCell }: CenterTabProps) => {
  const commonStyles = {
    single:
      "aspect-[3/2] w-[700px] rounded-sm border-2 border-gray-300 bg-white items-center flex justify-center text-[100px]",
    grid: "flex aspect-[3/2] w-[300px] items-center justify-center bg-white text-[80px]",
  };

  const currentPanel = selectedCell !== -1 ? comicData.panels[selectedCell] : null;

  return (
    <div className="flex-1 border-b">
      <div className="size-full border-b bg-gray-100">
        <div className="flex size-full items-center justify-center rounded-lg bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {selectedCell === -1 ? (
            <div>
              {comicData.panels.map((panel, index) => (
                <section key={index} id={index.toString()} className={commonStyles.grid}>
                  <>{index + 1}</>
                </section>
              ))}
            </div>
          ) : currentPanel ? (
            <section id={selectedCell.toString()} className={commonStyles.single}>
              <ImageEditor
                imageUrl={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${
                  currentPanel.key ?? currentPanel.originalKey
                }`}
                width={800}
                height={600}
              />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
};
