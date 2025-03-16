import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomDragLayer from "./components/custom-drag-layer";
import ScheduleView from "./components/schedule-view";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <ScheduleView />
        <CustomDragLayer />
      </div>
    </DndProvider>
  );
}

export default App;
