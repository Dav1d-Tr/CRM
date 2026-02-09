import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

interface CatalogContextType {
  priorityMap: Record<string, string>;
  lineMap: Record<string, string>;
  originMap: Record<string, string>;
  loading: boolean;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

interface CatalogItem {
  id: string;
  name: string;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [priorityMap, setPriorityMap] = useState<Record<string, string>>({});
  const [lineMap, setLineMap] = useState<Record<string, string>>({});
  const [originMap, setOriginMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<Record<string, string>>>
    ) => {
      const res = await fetch(`${API_BASE}/${endpoint}`);
      const data: CatalogItem[] = await res.json();

      const map = data.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});

      setter(map);
    };

    Promise.all([
      loadCatalog("priority", setPriorityMap),
      loadCatalog("line", setLineMap),
      loadCatalog("origin", setOriginMap),
    ])
      .catch((err) => console.error("Catalog error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CatalogContext.Provider
      value={{ priorityMap, lineMap, originMap, loading }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogContext() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalogContext debe usarse dentro de CatalogProvider");
  }
  return context;
}
