import { useState } from "react";

export const useSelectedCell = () => {
  const [selectedCell, setSelectedCell] = useState<number>(1);
  return { selectedCell, setSelectedCell };
}; 