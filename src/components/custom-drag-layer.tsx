import { useDragLayer } from "react-dnd";
import { ItemTypes } from "../lib/constants";
import type { Event } from "../types";
import DragPreview from "./drag-preview";

export default function CustomDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  // Only render for event items
  if (itemType !== ItemTypes.EVENT) {
    return null;
  }

  const event = item.event as Event;

  const layerStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  };

  const getItemStyles = (
    initialOffset: { x: number; y: number } | null,
    currentOffset: { x: number; y: number }
  ) => {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  };

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <DragPreview event={event} />
      </div>
    </div>
  );
}
