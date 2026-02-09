// src/components/ecommerce/DemographicCard.tsx
import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

interface CountryStat {
  id: number;
  name: string;
  customers: number;
  lat: number;
  lng: number;
  flag: string;
  percent: number;
}

export default function DemographicCard() {
  const [countries, setCountries] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        
        const data = await authFetch(
          `${API_BASE}/country/stats/customers`
        );

        if (!data || !Array.isArray(data)) {
          setCountries([]);
          return;
        }

        const totalCustomers = data.reduce(
          (s: number, c: any) => s + Number(c.customers || 0),
          0
        );

        const result: CountryStat[] = data.map((c: any) => ({
          ...c,
          customers: Number(c.customers || 0),
          lat: Number(c.lat),
          lng: Number(c.lng),
          percent:
            totalCustomers === 0
              ? 0
              : Math.round((Number(c.customers || 0) / totalCustomers) * 100),
        }));

        setCountries(result);
      } catch (e) {
        console.error("Error cargando demografía:", e);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando demografía…</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-500 bg-white p-5 dark:bg-white/[0.03] text-gray-800 dark:text-white/90 sm:p-6">
      <h3 className="text-lg font-semibold">Demografía de clientes</h3>
      <p className="text-sm text-gray-500">Clientes por país</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* MAPA */}
        <div className="hidden lg:block">
          <CountryMap
            markers={countries.map((c) => ({
              latLng: [c.lat, c.lng],
              name: `${c.name}: ${c.customers}`,
            }))}
          />
        </div>

        {/* LISTA */}
        <div className="grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-4">
          {countries.slice(0, 12).map((c) => (
            <div key={c.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={c.flag} className="w-8 h-5 rounded shadow" />
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">
                    {c.customers} clientes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-[140px]">
                <div className="w-full h-2 bg-gray-400 rounded">
                  <div
                    className="h-2 bg-brand-500 rounded"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
                <span className="font-medium">{c.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}