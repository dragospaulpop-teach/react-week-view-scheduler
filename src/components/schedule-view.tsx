import type { Row } from "../types";
import DayCell from "./day-cell";
import HeaderCell from "./header-cell";

const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const days = ["Luni", "Marti", "Miercuri", "Joi", "Vineri"];

const headers = [
  {
    label: "Ora",
    key: "header-hour",
  },
  ...days.map((day) => ({
    label: day,
    key: `header-${day}`,
  })),
];

const rows: Row = {
  "08:00": {
    Luni: [
      {
        label: "PWA",
        type: "course",
        room: "523",
        key: "event-1",
      },
    ],
    Marti: [
      {
        label: "PWA",
        type: "lab",
        room: "517",
        key: "event-3",
      },
    ],
  },
  "09:00": {
    Luni: [
      {
        label: "PSI",
        type: "course",
        room: "520",
        key: "event-2",
      },
    ],
    Marti: [
      {
        label: "PSI",
        type: "lab",
        room: "513",
        key: "event-4",
      },
    ],
  },
  "10:00": {
    Luni: [
      {
        label: "Engleza",
        type: "course",
        room: "523",
        key: "event-5",
      },
    ],
    Marti: [
      {
        label: "Engleza",
        type: "lab",
        room: "517",
        key: "event-6",
      },
    ],
  },
};

export default function ScheduleView() {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] grid-rows-[repeat(14,auto)] gap-2">
      {headers.map((header) => (
        <HeaderCell key={header.key} header={header} />
      ))}

      {hours.map((hour) => (
        <>
          <div
            key={`hour-${hour}`}
            className="border border-gray-300 rounded-md grid place-items-center p-2"
          >
            {hour}
          </div>
          {days.map((day) => (
            <DayCell key={`${hour}-${day}`} events={rows[hour]?.[day] || []} />
          ))}
        </>
      ))}
    </div>
  );
}
