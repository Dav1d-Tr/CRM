// src/hooks/useCatalog.ts
import { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

interface CatalogItem {
  id: number;
  name: string;
  status: boolean;
}

export function useCatalog(endpoint: "priority" | "line" | "origin") {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        if (!res.ok) throw new Error(`Error cargando ${endpoint}`);
        const data: CatalogItem[] = await res.json();

        const mapped = Object.fromEntries(
          data.map((item) => [String(item.id), item.name])
        );

        setMap(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [endpoint]);

  return map;
}
