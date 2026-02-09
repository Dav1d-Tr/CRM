// src/components/common/ActionLineList.tsx
import { useEffect, useRef } from "react";
import { useSidebar } from "../../context/SidebarContext";
import Button from "../ui/button/Button";
import { EXCELIcon } from "../../icons";

const ActionLineList = ({
  value,
  onChange,
  onExportExcel,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  value: string;
  onChange: (v: string) => void;
  onExportExcel: () => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isMobileOpen, isExpanded, isHovered } = useSidebar();

  const sidebarWidth =
    (isHovered || isExpanded) && !isMobileOpen ? 290 : 0;

  const headerWidth =
    window.innerWidth >= 1024
      ? `calc(100% - ${sidebarWidth}px)`
      : "100%";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div
        style={{ width: headerWidth }}
        className={`fixed right-0 w-fit z-10 mt-[90px] lg:mt-28 flex ${(isExpanded || isHovered) ? "" : "lg:pl-32"} flex-wrap max-sm:flex-col max-sm:items-start items-center justify-between gap-3 mb-6 w-full bg-white dark:bg-gray-900  py-3.5 px-8 lg:px-10`}
      >
        <div className="md:w-1/2 lg:w-2/5 w-full">
          <form>
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-700 dark:fill-gray-200"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>

              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar por codigos o nombres ..."
                className="dark:bg-dark-900 h-full w-full rounded-lg border border-gray-600 bg-transparent py-2.5 pl-12 pr-14 text-lg text-gray-800 shadow-theme-xs placeholder:text-gray-500 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-950 dark:bg-gray/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"

              />

              <button className="hidden lg:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-600 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <span> ⌘ </span>
                <span> K </span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex gap-2 md:gap-40">
          <div className="flex gap-2 text-gray-950 py-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-1 py-1 dark:bg-gray-600 max-sm:w-32 w-40"
              placeholder="Desde"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-1 py-1 dark:bg-gray-600 max-sm:w-32 w-40"
              placeholder="Hasta"
            />
          </div>

          <div className="flex gap-4">
            <Button
              size="md"
              variant="outline"
              startIcon={<EXCELIcon />}
              onClick={onExportExcel}
            >
              <span className="hidden lg:block">EXCEL</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionLineList;
