import { Tool } from "@/app/(editor)/comics/[id]/_components/tool-bar";
import { create } from "zustand";

type ToolState = {
  currentTool: Tool;
  setTool: (tool: Tool) => void;
  selectedBubbleId: string | null;
  setSelectedBubbleId: (id: string | null) => void;
};

export const useToolStore = create<ToolState>()((set) => ({
  currentTool: "pen",
  setTool: (tool: Tool) => set({ currentTool: tool }),
  selectedBubbleId: null,
  setSelectedBubbleId: (id) => set({ selectedBubbleId: id }),
}));
