// src/pages/Metrics/MetricsTotal.tsx
import { useEffect, useState } from "react";
import ProfitMetrics from "../../components/ecommerce/ProfitMetrics";
import PageMeta from "../../components/common/PageMeta";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface Lead {
  stateId?: number;
  quotedValue: number;
  billingValue: number;
}

interface RevenueStats {
  quoted: number;
  billed: number;
  period: string;
}

export default function MetricsTotal() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [monthly, setMonthly] = useState<RevenueStats | null>(null);
  const [quarterly, setQuarterly] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [leadsData, monthlyData, quarterlyData] = await Promise.all([
          authFetch(`${API_BASE}/lead`),
          authFetch(`${API_BASE}/lead/stats/revenue`),
          authFetch(`${API_BASE}/lead/stats/revenue?mode=quarterly`),
        ]);

        setLeads(Array.isArray(leadsData) ? leadsData : []);
        setMonthly(monthlyData);
        setQuarterly(quarterlyData);
      } catch (err) {
        console.error("Error cargando métricas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ===================== GENERAL ===================== */
  const validLeadsForMoney = leads.filter((l) => l.stateId !== 8);

  const totalQuotedValue = validLeadsForMoney.reduce(
    (sum, l) => sum + (Number(l.quotedValue) || 0),
    0
  );

  const totalBillingValue = validLeadsForMoney.reduce(
    (sum, l) => sum + (Number(l.billingValue) || 0),
    0
  );

  if (loading) {
    return <div className="mt-20 px-8">Cargando dashboard…</div>;
  }

  return (
    <>
      <PageMeta
        title="Home | CRM Demetalicos SAS"
        description="Dashboard principal"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6 mt-20">
        <div className="col-span-12 space-y-8 px-6 lg:px-8">

          {/* GENERAL */}
          <div className="grid gap-2">
            <strong className="text-gray-900 dark:text-gray-100 font-extrabold text-lg lg:text-2xl">
              Cotización y Facturación General
            </strong>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              <ProfitMetrics
                data={totalQuotedValue}
                title="Cotización General"
              />
              <ProfitMetrics
                data={totalBillingValue}
                title="Facturación General"
              />
            </div>
          </div>

          {/* TRIMESTRAL */}
          <div className="grid gap-2">
            <strong className="text-gray-900 dark:text-gray-100 font-extrabold text-lg lg:text-2xl">
              Cotización y Facturación Trimestral ({quarterly?.period})
            </strong>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              <ProfitMetrics
                data={quarterly?.quoted ?? 0}
                title="Cotización Trimestral"
              />
              <ProfitMetrics
                data={quarterly?.billed ?? 0}
                title="Facturación Trimestral"
              />
            </div>
          </div>

          {/* MENSUAL */}
          <div className="grid gap-2">
            <strong className="text-gray-900 dark:text-gray-100 font-extrabold text-lg lg:text-2xl">
              Cotización y Facturación Mensual ({monthly?.period})
            </strong>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              <ProfitMetrics
                data={monthly?.quoted ?? 0}
                title="Cotización Mensual"
              />
              <ProfitMetrics
                data={monthly?.billed ?? 0}
                title="Facturación Mensual"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
