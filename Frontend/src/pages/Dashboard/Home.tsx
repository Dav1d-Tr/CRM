// src/pages/Dashboard/Home.tsx
import { useEffect, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import ProfitMetrics from "../../components/ecommerce/ProfitMetrics";
import TimeMetrics from "../../components/ecommerce/TimeMetrics";
import { HeadsetIcon, Loop, Marketing, ShootingStarIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface Lead {
  originId?: number;
  stateId?: number;
  quotedValue: number;
  billingValue: number;
}

interface TimeMetric {
  lineId: number;
  prospeccion?: number;
  cotizacion?: number;
  ingenieria?: number;
  seguimiento?: number;
  kickoff?: number;
  ov?: number;
  facturacion?: number;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [timeMetrics, setTimeMetrics] = useState<TimeMetric[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== LEADS ===================== */
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await authFetch(`${API_BASE}/lead`);
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando leads:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  /* ===================== TIME METRICS ===================== */

  useEffect(() => {
    const fetchTimeMetrics = async () => {
      try {
        const data: TimeMetric[] =
          (await authFetch(`${API_BASE}/lead/metrics/time`)) || [];

        const origamiData = data.find((l) => l.lineId === 1);
        const tradicionalData = data.find((l) => l.lineId === 2);

        setTimeMetrics([
          { lineId: 1, ...origamiData },
          { lineId: 2, ...tradicionalData },
        ]);
      } catch (error) {
        console.error("Error cargando métricas de tiempo:", error);
        setTimeMetrics([]);
      }
    };

    fetchTimeMetrics();
  }, []);

  /* ===================== METRICAS GENERALES ===================== */
  const totalLeads = leads.length;
  const facturados = leads.filter((l) => l.stateId === 7).length;
  const mercadeo = leads.filter((l) => l.originId === 1).length;
  const historial = leads.filter((l) => l.originId === 2).length;

  const safePercent = (value: number) =>
    totalLeads === 0 ? "0" : Math.round((value / totalLeads) * 100).toString();

  /* ===================== METRICAS DINERO ===================== */
  const validLeadsForMoney = leads.filter((lead) => lead.stateId !== 8);

  const totalQuotedValue = validLeadsForMoney.reduce(
    (sum, lead) => sum + (Number(lead.quotedValue) || 0),
    0
  );

  const totalBillingValue = validLeadsForMoney.reduce(
    (sum, lead) => sum + (Number(lead.billingValue) || 0),
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
        <div className="col-span-12 space-y-6 px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            <EcommerceMetrics
              icon={<Loop />}
              title="Leads Totales"
              data={totalLeads.toString()}
              percent={false}
            />
            <EcommerceMetrics
              icon={<HeadsetIcon />}
              title="Leads Facturados"
              data={facturados.toString()}
              percentage={safePercent(facturados)}
              percent
            />
            <EcommerceMetrics
              icon={<Marketing />}
              title="Leads por Pauta"
              data={mercadeo.toString()}
              percentage={safePercent(mercadeo)}
              percent
            />
            <EcommerceMetrics
              icon={<ShootingStarIcon />}
              title="Leads Orgánicos"
              data={historial.toString()}
              percentage={safePercent(historial)}
              percent
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <ProfitMetrics data={totalQuotedValue} title="Total Cotizado" />
            <ProfitMetrics data={totalBillingValue} title="Total Facturado" />
          </div>

          <MonthlySalesChart />

          <div className="col-span-12 xl:col-span-5">
            <DemographicCard />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <TimeMetrics
              title="Métricas De Tiempo Promedio Linea Tradicional"
              data={timeMetrics.find((l) => l.lineId === 1)}
            />
            <TimeMetrics
              title="Métricas De Tiempo Promedio Linea Origami"
              data={timeMetrics.find((l) => l.lineId === 2)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
