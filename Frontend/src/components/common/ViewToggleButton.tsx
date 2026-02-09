import { ListIcon, Columns } from "../../icons";
import { usePlanner } from "../../context/PlannerContext";

export const ViewToggleButton: React.FC = () => {
  const { toggleViewMode, viewMode } = usePlanner();

  return (
    <button
      onClick={toggleViewMode}
      className="relative flex items-center justify-center text-gray-600 transition-colors bg-white border border-gray-600 rounded-2xl hover:bg-gray-100 h-12 w-12 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-400"
    >
      {viewMode === "columns" ? (
        <ListIcon className="w-5 h-5" />
      ) : (
        <Columns className="w-6 h-6" />
      )}
    </button>
  );
};
