import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CityForm from "../components/admin/CityForm";
import TableCity from "../components/admin/TableCity";
import { authFetch } from "../services/authFetch";
import { API_BASE } from "../config/api";

interface City {
    id: number;
    name: string;
    countryId: number;
    countryName?: string;
}

interface Country {
    id: number;
    name: string;
}

export default function CityAdmin() {

    const [cities, setCities] = useState<City[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const loadCities = async (filter = "") => {
        const url = filter
            ? `${API_BASE}/city/search?q=${filter}`
            : `${API_BASE}/city`;


        try {
            const data = await authFetch(url);
            setCities(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando cities:", err);
            setCities([]);
        }
    };

    const loadCountries = async () => {
        try {
            const data = await authFetch(`${API_BASE}/country`);
            setCountries(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando countries:", err);
            setCountries([]);
        }
    };

    useEffect(() => {
        loadCities();
        loadCountries();
    }, []);

    return (
        <>
            <PageMeta title="Ciudades" description="Admin" />
            <PageBreadcrumb pageTitle="Ciudades" />

            <div className="mt-28 space-y-6 px-4 lg:p-6">

                <CityForm
                    selectedCity={selectedCity}
                    clearSelection={() => setSelectedCity(null)}
                    reload={loadCities}
                    countries={countries}
                />

                <TableCity
                    cities={cities}
                    onLoad={(city: City) => setSelectedCity(city)}
                />
            </div>
        </>
    );
}
