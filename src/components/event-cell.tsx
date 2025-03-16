import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { deleteEvent, updateEvent } from "../lib/api";
import { ItemTypes } from "../lib/constants";
import { cn } from "../lib/utils";
import type { Event } from "../types";

interface EventCellProps {
  event: Event;
  hour: string;
  day: string;
  onUpdate: () => void;
}

export default function EventCell({
  event,
  hour,
  day,
  onUpdate,
}: EventCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    label: event.label,
    room: event.room,
    type: event.type,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference to prevent drag when clicking edit/delete buttons
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  // Set up drag
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: {
      eventKey: event.key,
      sourceHour: hour,
      sourceDay: day,
      event,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Use empty image as drag preview (we'll use custom preview)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Connect the drag ref to our element ref
  drag(eventRef);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      label: event.label,
      room: event.room,
      type: event.type,
    });
  };

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
      await updateEvent(hour, day, event.key, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteEvent(hour, day, event.key);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete event:", error);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-gray-300 rounded-md p-2 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label
              htmlFor="label"
              className="block text-xs font-medium text-gray-700"
            >
              Label
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="room"
              className="block text-xs font-medium text-gray-700"
            >
              Room
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-xs font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full text-xs border border-gray-300 rounded-md p-1"
              required
            >
              <option value="course">Course</option>
              <option value="lab">Lab</option>
              <option value="exam">Exam</option>
              <option value="break">Break</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs bg-gray-200 px-2 py-1 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={eventRef}
      className={cn(
        "event-cell border border-gray-300 rounded-md p-2 text-xs relative group cursor-move",
        event.type === "course" && "bg-blue-100",
        event.type === "lab" && "bg-green-100",
        event.type === "exam" && "bg-red-100",
        event.type === "break" && "bg-yellow-100",
        event.type === "other" && "bg-gray-100",
        isDragging && "dragging"
      )}
    >
      <div className="flex flex-col gap-1 items-center justify-center">
        <div className="font-bold">{event.label}</div>
        <div className="text-xs">{event.room}</div>
      </div>

      <div
        ref={actionButtonsRef}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
          title="Delete"
          disabled={isDeleting}
        >
          ×
        </button>
      </div>
    </div>
  );
}
