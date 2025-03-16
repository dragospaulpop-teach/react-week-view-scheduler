import type { Event, Header, Row } from "../types";

// Static data
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

const headers: Header[] = [
  {
    label: "Ora",
    key: "header-hour",
  },
  ...days.map((day) => ({
    label: day,
    key: `header-${day}`,
  })),
];

// Use let instead of const to allow modifications
let scheduleData: Row = {
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

// Helper to generate unique keys for events
let eventIdCounter = 7; // Start after the last event key
const generateEventKey = () => `event-${eventIdCounter++}`;

// READ operations
export async function getHours(): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return hours;
}

export async function getDays(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return days;
}

export async function getHeaders(): Promise<Header[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return headers;
}

export async function getScheduleData(): Promise<Row> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...scheduleData };
}

export async function getEventsForHourAndDay(
  hour: string,
  day: string
): Promise<Event[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...(scheduleData[hour]?.[day] || [])];
}

// CREATE operations
export async function addEvent(
  hour: string,
  day: string,
  event: Omit<Event, "key">
): Promise<Event> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Initialize hour and day if they don't exist
  if (!scheduleData[hour]) {
    scheduleData[hour] = {};
  }

  if (!scheduleData[hour][day]) {
    scheduleData[hour][day] = [];
  }

  const newEvent: Event = {
    ...event,
    key: generateEventKey(),
  };

  scheduleData[hour][day].push(newEvent);

  return newEvent;
}

// UPDATE operations
export async function updateEvent(
  hour: string,
  day: string,
  eventKey: string,
  updatedEvent: Omit<Event, "key">
): Promise<Event | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!scheduleData[hour]?.[day]) {
    return null;
  }

  const eventIndex = scheduleData[hour][day].findIndex(
    (event) => event.key === eventKey
  );

  if (eventIndex === -1) {
    return null;
  }

  const updatedEventWithKey: Event = {
    ...updatedEvent,
    key: eventKey,
  };

  scheduleData[hour][day][eventIndex] = updatedEventWithKey;

  return updatedEventWithKey;
}

// Move an event from one time slot to another
export async function moveEvent(
  fromHour: string,
  fromDay: string,
  toHour: string,
  toDay: string,
  eventKey: string
): Promise<Event | null> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!scheduleData[fromHour]?.[fromDay]) {
    return null;
  }

  const eventIndex = scheduleData[fromHour][fromDay].findIndex(
    (event) => event.key === eventKey
  );

  if (eventIndex === -1) {
    return null;
  }

  // Get the event to move
  const eventToMove = { ...scheduleData[fromHour][fromDay][eventIndex] };

  // Remove from original position
  scheduleData[fromHour][fromDay] = scheduleData[fromHour][fromDay].filter(
    (event) => event.key !== eventKey
  );

  // Initialize destination if needed
  if (!scheduleData[toHour]) {
    scheduleData[toHour] = {};
  }

  if (!scheduleData[toHour][toDay]) {
    scheduleData[toHour][toDay] = [];
  }

  // Add to new position
  scheduleData[toHour][toDay].push(eventToMove);

  return eventToMove;
}

// DELETE operations
export async function deleteEvent(
  hour: string,
  day: string,
  eventKey: string
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (!scheduleData[hour]?.[day]) {
    return false;
  }

  const initialLength = scheduleData[hour][day].length;

  scheduleData[hour][day] = scheduleData[hour][day].filter(
    (event) => event.key !== eventKey
  );

  return initialLength > scheduleData[hour][day].length;
}

// Clear all events for a specific hour and day
export async function clearEventsForHourAndDay(
  hour: string,
  day: string
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (!scheduleData[hour]?.[day]) {
    return false;
  }

  scheduleData[hour][day] = [];
  return true;
}

// Reset all schedule data to initial state
export async function resetScheduleData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Reset to initial state (you would need to store the initial state separately in a real app)
  scheduleData = {
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

  // Reset the event counter
  eventIdCounter = 7;
}
