"use client";
import { CenterTab } from "@/app/(editor)/comics/[id]/_components/centertab";
import { ToolBar } from "@/app/(editor)/comics/[id]/_components/tool-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Panel } from "@prisma/client";
import {
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";

const logo = "logo.svg";

type TaskStatus = "waiting" | "generating" | "done";

const getStatusText = (status: TaskStatus): string => {
  switch (status) {
    case "waiting":
      return "待機中";
    case "generating":
      return "生成中";
    case "done":
      return "完了";
    default:
      return status;
  }
};

export type Comic = {
  id: string;
  userId: string;
  panels: Panel[];
};

type GenuiProps = {
  comicData: Comic;
};

export const Genui = ({ comicData }: GenuiProps) => {
  const [selectedCell, setSelectedCell] = useState<number>(-1);
  const [cfgScale, setCfgScale] = useState<number>(7);
  const [steps, setSteps] = useState<number>(20);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="relative flex flex-1">
      <div
        className={cn(
          `absolute z-10 flex h-full overflow-hidden border-r bg-gray-100 duration-300 ease-in-out`,
          isSidebarCollapsed ? "w-0" : "w-1/5 translate-x-0"
        )}
      >
        {!isSidebarCollapsed && (
          <>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="generate" className="m-2 rounded-3xl bg-white shadow-sm">
                <AccordionTrigger className="rounded-3xl  bg-white px-4">
                  生成キュー
                </AccordionTrigger>
                <AccordionContent className="rounded-b-3xl  bg-white px-4"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>

      <Button
        onClick={toggleSidebar}
        className={cn(
          `absolute z-50 m-2 size-12 border-collapse rounded-2xl border-2  bg-white p-0 text-black shadow-sm transition-all duration-300 hover:bg-gray-100 `,
          isSidebarCollapsed ? "left-0" : "left-[20%]"
        )}
      >
        {isSidebarCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
      </Button>
      <ToolBar className="absolute right-4 top-1/2 -translate-y-1/2" />
      <section
        className={`absolute top-20 z-50 m-2 border-collapse rounded-2xl border-2 bg-white p-0 text-black shadow-sm transition-all ${isSidebarCollapsed ? "left-0" : "left-[20%]"}`}
      >
        <div className="m-2 flex-col justify-items-center">
          <div className="m-2 select-none rounded-md border-2 shadow-md transition-all duration-200 hover:scale-125">
            {selectedCell !== -1 ? (
              <Minimize onClick={() => setSelectedCell(-1)} className="m-1 size-4" />
            ) : (
              <Maximize onClick={() => setSelectedCell(0)} className="m-1 size-4" />
            )}
          </div>

          <ChevronUp
            className={
              "m-2 size-7 select-none rounded-full border-2 shadow-md transition-all  duration-200 hover:scale-125"
            }
            onClick={() => setSelectedCell(Math.max(selectedCell - 1, 0))}
            color={selectedCell === 0 ? "gray" : "black"}
          />
          {comicData.panels.map((panel, index) => (
            <div
              key={index}
              onClick={() => setSelectedCell(index as 0 | 1 | 2 | 3)}
              className={`flex h-10 w-12 items-center justify-center rounded-md bg-slate-300 text-xl text-white shadow-md transition duration-100 hover:-translate-y-1 ${
                selectedCell === index ? "bg-blue-600" : "bg-slate-600"
              } cursor-pointer select-none border-2 duration-150 hover:scale-110`}
            >
              <span className="select-none text-[1rem] text-white">{index + 1}</span>
            </div>
          ))}
          <ChevronDown
            className="m-2 size-7 select-none rounded-full border-2 shadow-md transition-all duration-200 hover:scale-125"
            onClick={() => setSelectedCell(Math.min(selectedCell + 1, 3))}
            color={selectedCell === 3 ? "gray" : "black"}
          />
        </div>
      </section>

      <div
        className={`flex flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-0" : "ml-[20%]"
        }`}
      >
        <CenterTab comicData={comicData} selectedCell={selectedCell} />
      </div>
    </div>
  );
};
