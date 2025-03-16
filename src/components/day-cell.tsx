import { useRef } from "react";
import { useDrop } from "react-dnd";
import { moveEvent } from "../lib/api";
import { ItemTypes } from "../lib/constants";
import { cn } from "../lib/utils";
import type { Event as EventType } from "../types";
import EventCell from "./event-cell";

interface DayCellProps {
  events: EventType[];
  hour: string;
  day: string;
  onUpdate: () => void;
  onAddEvent: () => void;
}

export default function DayCell({
  events,
  hour,
  day,
  onUpdate,
  onAddEvent,
}: DayCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);

  // Set up drop target
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.EVENT,
    drop: async (item: {
      eventKey: string;
      sourceHour: string;
      sourceDay: string;
    }) => {
      // Don't do anything if dropped in the same cell
      if (item.sourceHour === hour && item.sourceDay === day) {
        return;
      }

      try {
        await moveEvent(
          item.sourceHour,
          item.sourceDay,
          hour,
          day,
          item.eventKey
        );
        onUpdate();
      } catch (error) {
        console.error("Failed to move event:", error);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Connect the drop ref to our element ref
  drop(cellRef);

  return (
    <div
      ref={cellRef}
      className={cn(
        "day-cell border border-gray-300 rounded-md flex flex-col gap-2 p-2 min-h-[80px] relative",
        isOver && canDrop && "can-drop",
        isOver && !canDrop && "no-drop"
      )}
    >
      {events.map((event) => (
        <EventCell
          key={event.key}
          event={event}
          hour={hour}
          day={day}
          onUpdate={onUpdate}
        />
      ))}

      {events.length === 0 && (
        <div className="text-gray-400 text-xs flex items-center justify-center h-full">
          No events
        </div>
      )}

      <button
        onClick={onAddEvent}
        className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        title="Add event"
      >
        +
      </button>
    </div>
  );
}
