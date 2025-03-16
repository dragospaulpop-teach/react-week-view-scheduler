import { cn } from "../lib/utils";
import type { Event } from "../types";

interface DragPreviewProps {
  event: Event;
}

export default function DragPreview({ event }: DragPreviewProps) {
  return (
    <div
      className={cn(
        "border border-gray-300 rounded-md p-2 text-xs shadow-lg",
        event.type === "course" && "bg-blue-100",
        event.type === "lab" && "bg-green-100",
        event.type === "exam" && "bg-red-100",
        event.type === "break" && "bg-yellow-100",
        event.type === "other" && "bg-gray-100"
      )}
      style={{ width: "150px", opacity: 0.8 }}
    >
      <div className="flex flex-col gap-1 items-center justify-center">
        <div className="font-bold">{event.label}</div>
        <div className="text-xs">{event.room}</div>
      </div>
    </div>
  );
}
