import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CharacterFormValues } from "./form-schema";

interface CharacterCardProps {
  character: CharacterFormValues;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  return (
    <div className="relative rounded-lg border p-4">
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onEdit();
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="absolute right-2 top-2 size-6"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
        >
          <X className="size-4" />
        </Button>
        <h3 className="font-medium">{character.charactername}</h3>
        <p className="text-sm text-gray-500">
          性別:{" "}
          {character.gender === "man" ? "男性" : character.gender === "woman" ? "女性" : "その他"}
        </p>
      </div>
    </div>
  );
}
