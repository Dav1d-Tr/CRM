// src/components/metrics/MonthlyMetricsTable.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Hashtag, CalenderIcon } from "../../icons";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface MonthlyLead {
  month: string; // "2025-01"
  total: number;
}

export default function MonthlyMetricsTable() {
  const [data, setData] = useState<MonthlyLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 👇 Ahora con seguridad, token y control de sesión
        const res = await authFetch(`${API_BASE}/lead/stats/monthly`);

        if (!res || !Array.isArray(res)) {
          setData([]);
          return;
        }

        setData(res);
      } catch (err) {
        console.error("Error cargando métricas:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const groupedByYear = useMemo(() => {
    return data.reduce<Record<number, { month: number; total: number }[]>>(
      (acc, item) => {
        const [yearStr, monthStr] = item.month.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr);

        acc[year] ??= [];
        acc[year].push({ month, total: Number(item.total || 0) });

        return acc;
      },
      {}
    );
  }, [data]);

  if (loading) {
    return <div className="p-6">Cargando métricas…</div>;
  }

  return (
    <div className="grid gap-6">
      {Object.entries(groupedByYear).map(([year, months]) => (
        <div key={year}>
          {/* Año */}
          <div className="w-full bg-[#8e1a32] px-6 py-1.5 rounded-xl lg:rounded-2xl mb-2">
            <strong className="text-white text-2xl lg:text-title-sm">
              {year}
            </strong>
          </div>

          {/* Tabla */}
          <div className="overflow-hidden rounded-xl border border-gray-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.05]">
            <div className="w-full overflow-x-auto md:overflow-visible">
              <Table>
                <TableHeader className="border-b border-gray-600 dark:border-white/[0.80] bg-white dark:bg-gray-950">
                  <TableRow className="grid grid-cols-2 items-center lg:text-xl text-[14px]">
                    <TableCell
                      isHeader
                      className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                    >
                      Mes
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-3 py-3 font-semibold text-gray-700 dark:text-white/90"
                    >
                      Número de Casos
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.2] text-gray-600 dark:text-white/90">
                  {months
                    .sort((a, b) => a.month - b.month)
                    .map((m) => (
                      <TableRow
                        key={`${year}-${m.month}`}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.05] grid grid-cols-2"
                      >
                        <TableCell className="px-3 py-3 text-sm">
                          <span className="flex gap-1 items-center justify-center">
                            <CalenderIcon />
                            {MONTHS[m.month - 1]}
                          </span>
                        </TableCell>

                        <TableCell className="px-3 py-3 text-sm">
                          <span className="flex gap-1 items-center justify-center">
                            <Hashtag />
                            {m.total}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}