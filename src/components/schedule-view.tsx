import { useEffect, useState } from "react";
import {
  addEvent,
  getDays,
  getHeaders,
  getHours,
  getScheduleData,
  resetScheduleData,
} from "../lib/api";
import type { Event, Header, Row } from "../types";
import DayCell from "./day-cell";
import HeaderCell from "./header-cell";

interface AddEventModalProps {
  hour: string;
  day: string;
  onClose: () => void;
  onSave: (event: Omit<Event, "key">) => Promise<void>;
}

function AddEventModal({ hour, day, onClose, onSave }: AddEventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "key">>({
    label: "",
    room: "",
    type: "course",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Failed to add event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          Add Event - {day} at {hour}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-700"
            >
              Label
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="mt-1 block w-full text-sm border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="mt-1 block w-full text-sm border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full text-sm border border-gray-300 rounded-md p-2"
              required
            >
              <option value="course">Course</option>
              <option value="lab">Lab</option>
              <option value="exam">Exam</option>
              <option value="break">Break</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ScheduleView() {
  const [hours, setHours] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<Row>({});
  const [isLoading, setIsLoading] = useState(true);
  const [addEventModal, setAddEventModal] = useState<{
    isOpen: boolean;
    hour: string;
    day: string;
  }>({
    isOpen: false,
    hour: "",
    day: "",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [hoursData, daysData, headersData, scheduleData] =
        await Promise.all([
          getHours(),
          getDays(),
          getHeaders(),
          getScheduleData(),
        ]);

      setHours(hoursData);
      setDays(daysData);
      setHeaders(headersData);
      setRows(scheduleData);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvent = (hour: string, day: string) => {
    setAddEventModal({
      isOpen: true,
      hour,
      day,
    });
  };

  const handleCloseModal = () => {
    setAddEventModal({
      isOpen: false,
      hour: "",
      day: "",
    });
  };

  const handleSaveEvent = async (eventData: Omit<Event, "key">) => {
    await addEvent(addEventModal.hour, addEventModal.day, eventData);
    handleCloseModal();
    fetchData();
  };

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all schedule data?")) {
      try {
        await resetScheduleData();
        fetchData();
      } catch (error) {
        console.error("Failed to reset schedule data:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading schedule...</div>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Weekly Schedule</h1>
        <div className="flex gap-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Tip:</span> Drag and drop events to
            move them
          </div>
          <button
            onClick={handleResetData}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
          >
            Reset Data
          </button>
        </div>
      </div>

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
              <DayCell
                key={`${hour}-${day}`}
                events={rows[hour]?.[day] || []}
                hour={hour}
                day={day}
                onUpdate={fetchData}
                onAddEvent={() => handleAddEvent(hour, day)}
              />
            ))}
          </>
        ))}
      </div>

      {addEventModal.isOpen && (
        <AddEventModal
          hour={addEventModal.hour}
          day={addEventModal.day}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
