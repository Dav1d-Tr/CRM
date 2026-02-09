// src/components/common/ActionLine.tsx
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";
import Button from "../ui/button/Button";
import { AddIcon, EXCELIcon } from "../../icons";
import { ViewToggleButton } from "./ViewToggleButton";
import CreateProspectModal from "../planner/CreateProspectModal";
import { Lead } from "../../pages/Planner";
import * as XLSX from "xlsx";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

function excelDateToJSDate(serial: number) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return dateInfo.toISOString().slice(0, 19).replace("T", " ");
}

const ActionLine = ({
  value,
  onChange,
  results,
  onSelectLead,
}: {
  value: string;
  onChange: (v: string) => void;
  results: Lead[];
  onSelectLead: (lead: Lead) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [openProspectModal, setOpenProspectModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobileOpen, isExpanded, isHovered } = useSidebar();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [, setImportProcessing] = useState(false);
  const [, setImportReport] = useState<any>(null);

  const sidebarWidth =
    (isHovered || isExpanded) && !isMobileOpen ? 290 : 0;
  const headerWidth =
    window.innerWidth >= 1024
      ? `calc(100% - ${sidebarWidth}px)`
      : "100%";

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        onSelectLead(results[activeIndex]);
      }
    }
  };

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

  const handleLeadCreated = (lead: any) => {
    console.log("Lead creado:", lead);
  };

  return (
    <>
      <div
        style={{ width: headerWidth }}
        className={`fixed right-0 z-10 mt-20 px-4 lg:mt-[112px] flex ${(isExpanded || isHovered) ? "" : "lg:pl-32"} flex-wrap items-center justify-between gap-3 mb-6 w-full bg-white dark:bg-gray-900  py-3.5 px-1 lg:px-10`}
      >
        <div className="flex justify-around max-sm:w-full lg:gap-3">
          <Button
            size="md"
            variant="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenProspectModal(true)}
          >
            Nueva prospección
          </Button>

          <Button
            size="md"
            variant="outline"
            startIcon={<EXCELIcon />}
            onClick={() => fileRef.current?.click()}
          >
            Importar Excel
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                setImportProcessing(true);
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer);
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                const normalized = raw.map((row: any) => ({
                  caso: row["caso"] || row["CASO"] || row["Caso"],

                  codigo_cliente:
                    row["codigo_cliente"] ||
                    row["Código Cliente"],

                  codigo_contacto:
                    row["codigo_contacto"] ||
                    row["Código Contacto"],

                  cliente: row["cliente"] || row["Cliente"],

                  pais: row["pais"] || row["País"],

                  ciudad: row["ciudad"] || row["Ciudad"],

                  contacto: row["contacto"] || row["Contacto"],

                  correo: row["correo"] || row["Email"] || row["Correo"],

                  telefono: row["telefono"]
                    ? String(row["telefono"]).trim()
                    : row["Teléfono"]
                      ? String(row["Teléfono"]).trim()
                      : null,


                  encargado:
                    row["encargado"] ||
                    row["Encargado"] ||
                    row["Usuario"],

                  estado: row["estado"] || row["Estado"],

                  prioridad: row["prioridad"] || row["Prioridad"],

                  origen: row["origen"] || row["Origen"],

                  linea: row["linea"] || row["Línea"],

                  producto: row["producto"] || row["Producto"],

                  observaciones:
                    row["observaciones"] ||
                    row["Observación"],

                  cancelacion:
                    row["cancelacion"] ||
                    row["Motivo de Cancelación"],

                  cotizacion:
                    row["cotizacion"] ||
                    row["Cotización"],

                  cotizado: row["cotizado"] || row["Valor Cotizado"],

                  ov: row["ov"] || row["OV"],

                  fecha_ov: row["Fecha OV"]
                    ? excelDateToJSDate(row["Fecha OV"])
                    : null,

                  facturacion:
                    row["facturacion"] ||
                    row["Facturación"],

                  facturado:
                    row["facturado"] ||
                    row["Valor Facturado"],

                  fecha_creacion: row["Fecha Creación"]
                    ? excelDateToJSDate(row["Fecha Creación"])
                    : null,

                  fecha_cotizacion: row["Fecha Cotización"]
                    ? excelDateToJSDate(row["Fecha Cotización"])
                    : null,

                  fecha_facturacion: row["Fecha Facturación"]
                    ? excelDateToJSDate(row["Fecha Facturación"])
                    : null,
                }));

                console.log("IMPORT DATA:", normalized);

                const res = await authFetch(`${API_BASE}/lead/import`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ rows: normalized })
                });

                setImportReport(res);
                window.location.reload();
              } catch (err: any) {
                console.error("Import frontend error:", err);
              } finally {
                setImportProcessing(false);
                // reset input
                if (fileRef.current) fileRef.current.value = "";
              }
            }}
          />
        </div>


        <div className="w-full lg:w-2/5">
          <form>
            <div className="relative ">
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
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Buscar por Lead, Cliente, Cotización, OV, Facturación..."
                className="dark:bg-dark-900 h-full w-full rounded-lg border border-gray-600 bg-transparent py-2.5 pl-12 pr-14 text-lg text-gray-800 shadow-theme-xs placeholder:text-gray-500 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-950 dark:bg-gray/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              {isFocused && results.length > 0 && (
                <div className="absolute top-full mt-1 w-full text-gray-800 dark:text-white/90 bg-white dark:bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
                  {results.map((lead, index) => (
                    <div
                      key={lead.id}
                      className={`px-4 py-2 cursor-pointer ${index === activeIndex
                        ? "bg-brand-500/20 dark:bg-brand-500/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={() => onSelectLead(lead)}
                    >
                      <div className="font-semibold">
                        {lead.customer?.name ?? "Cliente desconocido"}
                      </div>
                      <div className="flex justify-between flex-col gap-1 lg:flex-row ">
                        <div className="text-xs text-gray-500">
                          Lead #{lead.id} — {lead.state}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button className="hidden lg:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-600 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                <span> ⌘ </span>
                <span> K </span>
              </button>
            </div>
          </form>
        </div>

        <div className="hidden md:block gap-3 items-center">
          <ViewToggleButton />
        </div>
      </div>

      {/* MODAL */}
      <CreateProspectModal
        open={openProspectModal}
        onClose={() => setOpenProspectModal(false)}
        onLeadCreated={handleLeadCreated}
      />
    </>
  );
};

export default ActionLine;
