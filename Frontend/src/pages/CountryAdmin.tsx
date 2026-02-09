import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import CountryForm from "../components/admin/CountryForm";
import PageMeta from "../components/common/PageMeta";
import TableCountry from "../components/admin/TableCountry";
import { authFetch } from "../services/authFetch";
import { API_BASE } from "../config/api";

// Tipo

interface Country {
  id: number;
  name: string;
  flag: string;
  lat: string;
  lng: string;
  prefix: string;
  status: boolean;
}

export default function CountryAdmin() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const loadCountries = async () => {
    const data: Country[] = await authFetch(`${API_BASE}/country`);
    setCountries(data);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <>
      <PageMeta title="Países" description="Admin" />
      <PageBreadcrumb pageTitle="Países" />

      <div className="mt-28 space-y-6 px-4 lg:p-6">
        <CountryForm
          selectedCountry={selectedCountry}
          clearSelection={() => setSelectedCountry(null)}
          reload={loadCountries}
        />

        <TableCountry
          countries={countries}
          onLoad={(country: Country) => setSelectedCountry(country)}
        />
      </div>
    </>
  );
}
