import { DollarLineIcon } from "../../icons";
import { useSidebar } from "../../context/SidebarContext";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface ProfitMetricsProps {
  title: string;
  data: number;
}


export default function ProfitMetrics({ data, title }: ProfitMetricsProps) {
  const { isExpanded } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-500 bg-white p-5 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between">
          <div className="flex items-center justify-center w-10 h-10 lg:w-16 lg:h-16 bg-gray-300 rounded-xl dark:bg-gray-800">
            <DollarLineIcon className="text-gray-800 size-8 lg:size-12 dark:text-white/90" />
          </div>
          <div className="relative inline-block">
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <MoreDotIcon className="size-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>

            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="w-40 p-2"
            >
              <DropdownItem
                to="/metricsTotal"
                tag="a"
                onItemClick={() => setIsOpen(false)}
              >
                <span className="text-gray-200">
                  Ver Más
                </span>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-end justify-end mt-5">
          <div className="flex flex-col items-end">
            <h4
              className={`font-bold text-gray-800 ${isExpanded ? "text-title-lg" : "text-2xl lg:text-title-lg"
                } dark:text-white/90`}
            >
              {data.toLocaleString('es-CO')}
            </h4>
            <span className="mt-2 text-lg lg:text-2xl text-gray-500 dark:text-gray-400">
              {title}
            </span>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

    </div>
  );
}
