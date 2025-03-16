import type { Event as EventType } from "../types";
import EventCell from "./event-cell";

export default function DayCell({ events }: { events: EventType[] }) {
  return (
    <div className="border border-gray-300 rounded-md flex flex-col gap-2 p-2">
      {events.map((event) => (
        <EventCell key={event.key} event={event} />
      ))}
    </div>
  );
}
