// src/CardLead.tsx
import { useEffect, useState } from "react";
import { TaskIcon, ChatIcon, CalenderIcon } from "../../icons";
import { usePlanner } from "../../context/PlannerContext";
import { useSidebar } from "../../context/SidebarContext";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface LeadStats {
  completedTasks: number;
  totalTasks: number;
  comments: number;
}

{/*
  interface CatalogItem {
    id: number | string;
    name: string;
    status?: boolean;
  }
*/}

interface CardLeadProps {
  id: string;
  codeCustomer: string;
  customer: string;
  priorityId: string;
  lineId: string;
  originId: string;
  codePrice: string;
  valuePrice: string;
  ownerAvatar?: string;
  ownerName?: string;
  onOpen: () => void;
}

export default function CardLead({
  id,
  codeCustomer,
  customer,
  priorityId,
  lineId,
  originId,
  codePrice,
  valuePrice,
  //ownerAvatar,
  ownerName,
  onOpen,
}: CardLeadProps) {
  const { viewMode } = usePlanner();
  const { isExpanded } = useSidebar();
  const { isMobileOpen } = useSidebar();

  const [stats, setStats] = useState<LeadStats>({
    completedTasks: 0,
    totalTasks: 0,
    comments: 0,
  });

  const [priorityName, setPriorityName] = useState("—");
  const [lineName, setLineName] = useState("—");
  const [originName, setOriginName] = useState("—");
  const [createdDate, setCreatedDate] = useState<string | null>(null);


  useEffect(() => {
    const fetchCreatedDate = async () => {
      try {
        const data = await authFetch(`${API_BASE}/lead/${id}/created-date`);

        if (data?.createdAt) {
          setCreatedDate(data.createdAt);
        }
        if (data?.createdAt) {
          setCreatedDate(data.createdAt);
        }
      } catch (err) {
        console.error("Error cargando fecha creación:", err);
        setCreatedDate(null);
      }
    };

    fetchCreatedDate();
  }, [id]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authFetch(`${API_BASE}/lead/${id}/stats`);

        if (!data) return;

        setStats({
          totalTasks: Number(data.totalTasks) || 0,
          completedTasks: Number(data.completedTasks) || 0,
          comments: Number(data.comments) || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [id]);

  useEffect(() => {
    const fetchCatalogName = async (
      endpoint: string,
      idValue: string,
      setter: (value: string) => void
    ) => {
      if (!idValue || idValue === "undefined" || idValue === "null") {
        setter("—");
        return;
      }

      try {
        const data = await authFetch(`${API_BASE}/${endpoint}`);

        if (!Array.isArray(data)) {
          setter("—");
          return;
        }

        const found = data.find((item) => String(item.id) === String(idValue));
        setter(found?.name ?? "—");
      } catch (error) {
        console.error(`Catalog ${endpoint} error:`, error);
        setter("—");
      }
    };

    fetchCatalogName("priority", priorityId, setPriorityName);
    fetchCatalogName("line", lineId, setLineName);
    fetchCatalogName("origin", originId, setOriginName);
  }, [priorityId, lineId, originId]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const priorityColor =
    priorityName === "Alta"
      ? "bg-[#C70A39]"
      : priorityName === "Media"
        ? "bg-[#7B7D55]"
        : "bg-[#409494]";

  const lineColor = lineName === "Origami" ? "bg-[#60765B]" : "bg-[#8e1a32]";

  const originColor = originName === "Pauta" ? "bg-[#ec4a0a]" : "bg-[#63C263]";

  const avatarUrl = ownerName
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      ownerName
    )}`
    : "/images/user/default.png";

  const formattedPrice = (() => {
    const n = Number(valuePrice);
    if (isNaN(n)) return valuePrice; // por si viene algo raro
    return n.toLocaleString("es-CO");
  })();

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onClick={onOpen}
      className={`w-full px-2 lg:px-3 py-3 flex gap-1 lg:gap-3 bg-white border border-gray-500 dark:bg-gray-900 cursor-pointer rounded-lg hover:scale-[1.01] transition
  ${viewMode === "columns"
          ? "flex-col"
          : isMobileOpen
            ? "flex-wrap"
            : isExpanded
              ? "flex-wrap justify-around items-center"
              : "flex-wrap justify-around items-center"
        }
`}
    >
      <div className={`flex ${viewMode === "columns" ? "flex-col gap-4" : isExpanded ? "items-center w-full lg:w-2/3 lg:flex-row-reverse gap-1 lg:gap-12 flex-col" : "items-center w-full lg:w-2/3 lg:flex-row-reverse gap-1 lg:gap-12 flex-col"}`}>
        <div className="flex gap-3 lg:gap-1 text-sm text-white/90">
          <span
            className={`p-1 rounded-lg text-center w-[90px] ${priorityColor}`}>
            {priorityName}
          </span>
          <span className={`p-1 rounded-lg text-center w-[90px] ${lineColor}`}>
            {lineName}
          </span>
          <span
            className={`p-1 rounded-lg text-center w-[90px] ${originColor}`}>
            {originName}
          </span>
        </div>

        <div className={`flex text-gray-800 dark:text-white/90 w-full max-sm:px-4 ${viewMode === "columns" ? "flex-col gap-2 px-2" : "lg:w-2/3 flex max-sm:flex-col justify-between items-center lg:gap-6"}`}>
          <div className="grid grid-cols-1 max-sm:w-full max-sm:grid-cols-1 max-sm:px-4">
            <small
              className={`max-sm:text-base text-[18px] ${viewMode === "columns" ? "w-full" : `${isExpanded ? "lg:w-auto" : "lg:w-auto"}`}`} >
              Cliente: {codeCustomer}
            </small>
            <small className={`max-sm:text-base text-[18px] ${viewMode === "columns" ? "w-full" : `${isExpanded ? "lg:w-auto" : "lg:w-auto"}`}`} >
              {customer}
            </small>
          </div>

          <div className={`${viewMode === "columns" ? "border border-[#b22948]" : "max-sm:border max-sm:border-[#b22948] max-sm:w-11/12 max-sm:my-2" }`}></div>

          <div className="grid grid-cols-1 max-sm:w-full max-sm:grid-cols-1 max-sm:px-4">
            <small className={`max-sm:text-base text-[18px]  ${viewMode === "columns" ? "w-full" : `${isExpanded ? "lg:w-auto text-[12px]" : "xl:w-auto lg:text-[18px]"}`}`}>
              Caso # {id}
            </small>
          </div>

          <div className={`${(viewMode === "columns") ? "border border-[#b22948]" : "max-sm:border max-sm:border-[#b22948] max-sm:w-11/12 max-sm:my-2" }`}></div>

          <div className="grid grid-cols-1 max-sm:w-full max-sm:grid-cols-1 max-sm:px-4">
            <small
              className={`max-sm:text-base text-[18px] ${viewMode === "columns"
                ? "w-full"
                : `${isExpanded
                  ? "lg:w-auto text-[12px]"
                  : "xl:w-auto text-[18px]"
                }`
                }`}
            >
              Cotización: {codePrice}
            </small>

            <small
              className={`max-sm:text-base text-[18px] ${viewMode === "columns"
                ? "w-full"
                : `${isExpanded
                  ? "lg:w-auto text-[12px]"
                  : "xl:w-auto lg:text-[18px]"
                }`
                }`}
            >
              Valor $ {formattedPrice}

            </small>
          </div>
        </div>
      </div>

      <div className={`${viewMode === "columns" ? "grid grid-cols-1 gap-2" : "flex gap-4"}`}>

        <div
          className={`hidden lg:block text-gray-800 dark:text-white/90 px-2 ${viewMode === "columns"
            ? "flex flex-col text-base"
            : " flex lg:items-center"
            }`}
        >
          <span className="flex items-center gap-1.5">
            <CalenderIcon />
            {createdDate
              ? new Date(createdDate).toLocaleDateString("es-CO")
              : "—"}
          </span>
        </div>

        <div
          className={`flex items-center justify-around text-gray-800 dark:text-white/90 ${viewMode === "columns" ? "gap-3" : "gap-3 lg:gap-8"
            }`}
        >
          <div className="flex items-center gap-1">
            <TaskIcon className="w-6" />
            <span>
              {stats.completedTasks} / {stats.totalTasks}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <ChatIcon className="w-6" />
            <span>{stats.comments}</span>
          </div>

          <div
            className={`overflow-hidden rounded-full border border-gray-500 ${viewMode ? "w-6 h-6" : "w-12 h-12"
              }`}
          >
            <img
              src={avatarUrl}
              alt={ownerName ?? "Usuario"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
