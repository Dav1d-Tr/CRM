import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import LineForm from "../components/admin/LineForm";
import TableLine from "../components/admin/TableLine";
import { authFetch } from "../services/authFetch";
import { API_BASE } from "../config/api";

// Tipo
interface Line {
  id: number;
  name: string;
  status: boolean;
}

export default function LineAdmin() {

  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);

  const loadLines = async () => {
    const data: Line[] = await authFetch(`${API_BASE}/line`);
    setLines(data);
  };

  useEffect(() => {
    loadLines();
  }, []);

  return (
    <>
      <PageMeta title="Lineas" description="Administardor de Lineas" />
      <PageBreadcrumb pageTitle="Líneas" />

      <div className="mt-28 space-y-6 px-4 lg:p-6">

        <LineForm
          selectedLine={selectedLine}
          clearSelection={() => setSelectedLine(null)}
          reload={loadLines}
        />

        <TableLine
          lines={lines}
          onLoad={(line: Line) => setSelectedLine(line)}
        />
      </div>
    </>
  );
}
