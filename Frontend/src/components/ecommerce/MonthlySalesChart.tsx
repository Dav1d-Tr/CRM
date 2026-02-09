// src/components/ecommerce/MonthlySalesChart.tsx
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

const MAX_MONTHS = 14;

interface MonthlyLead {
  month: string;
  total: number;
}

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyLeads = async () => {
      try {
        const result: MonthlyLead[] =
          (await authFetch(`${API_BASE}/lead/stats/monthly`)) || [];

        // Filtrar solo meses con al menos 1 lead
        const filtered = result.filter((r) => r.total > 0);

        // Tomar solo los últimos MAX_MONTHS meses
        const lastMonths = filtered.slice(-MAX_MONTHS);

        // Formatear etiquetas y datos
        const labels = lastMonths.map((r) => {
          const [year, month] = r.month.split("-");
          const d = new Date(Number(year), Number(month) - 1);
          return new Intl.DateTimeFormat("es-ES", {
            month: "short",
            year: "numeric",
          }).format(d);
        });

        const totals = lastMonths.map((r) => r.total);

        setCategories(labels);
        setData(totals);
      } catch (error) {
        console.error("Error cargando leads mensuales:", error);
        setCategories([]);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyLeads();
  }, []);

  const options: ApexOptions = {
    colors: ["#8e1a32"],
    chart: {
      fontFamily: "Helvetica, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Leads",
      data,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-500 bg-white px-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="lg:text-lg font-semibold text-gray-800 dark:text-white/90">
          Número de Leads (Últimos 14 meses)
        </h3>

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
              to="/numberleadsmetrics"
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

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-max">
          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Cargando estadísticas…
            </p>
          ) : (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}
