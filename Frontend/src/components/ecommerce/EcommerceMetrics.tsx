import Badge from "../ui/badge/Badge";
import { useSidebar } from "../../context/SidebarContext";
import { ReactNode } from "react";

interface CardLeadProps {
  icon: ReactNode;
  title: string;
  data: string;
  percent: boolean;
  percentage?: string;
}

export default function EcommerceMetrics({
  icon,
  title,
  data,
  percent,
  percentage,
}: CardLeadProps) {
  const { isExpanded } = useSidebar();
  return (
    <div>
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border h-full border-gray-500 bg-white p-5 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between">
          <div className="flex items-center justify-center w-9 h-9 lg:w-16 lg:h-16 bg-gray-300 rounded-xl dark:bg-gray-800">
            <span className="text-gray-800 text-2xl lg:text-5xl dark:text-white/90">
              {icon}
            </span>
          </div>
          <div className={`flex items-center ${!percent ? "hidden" : "block"}`}>
            <Badge color="success">{percentage} %</Badge>
          </div>
        </div>
        <div className="flex items-end justify-end mt-5">
          <div className="flex flex-col items-end">
            <h4
              className={`font-bold text-gray-800 ${
                isExpanded ? "text-title-2xl" : "text-title-sm lg:text-title-lg"
              } dark:text-white/90`}
            >
              {data}
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
