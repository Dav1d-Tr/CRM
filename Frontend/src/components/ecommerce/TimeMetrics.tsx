interface TimeMetricsProps {
  title: string;
  data?: {
    prospeccion?: number;
    cotizacion?: number;
    ingenieria?: number;
    seguimiento?: number;
    kickoff?: number;
    ov?: number;
    facturacion?: number;
  };
}

const formatSeconds = (totalSeconds?: number) => {
  if (totalSeconds === undefined || totalSeconds === null) return "-";

  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
};


export default function TimeMetrics({ title, data }: TimeMetricsProps) {
  return (
    <div className="rounded-2xl p-5 md:p-6 text-gray-800 dark:text-white/90 border border-gray-500 bg-white px-5 pt-5 dark:bg-white/[0.03]">
      <strong className="text-lg block text-center">{title}</strong>

      <div className="mt-5 space-y-2">
        <Row label="Prospección" value={formatSeconds(data?.prospeccion)} />
        <Row label="Cotización" value={formatSeconds(data?.cotizacion)} />
        <Row label="Ingeniería" value={formatSeconds(data?.ingenieria)} />
        <Row label="Seguimiento" value={formatSeconds(data?.seguimiento)} />
        <Row label="Kick-Off" value={formatSeconds(data?.kickoff)} />
        <Row label="OV" value={formatSeconds(data?.ov)} />
        <Row label="Facturación" value={formatSeconds(data?.facturacion)} />
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <em>{value}</em>
  </div>
);
