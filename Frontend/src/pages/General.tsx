// src/pages/General.tsx
import { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import TableGeneral from "../components/tables/BasicTables/TableGeneral";
import ActionLineList from "../components/common/ActionLineList";
import { useSearchParams } from "react-router-dom";
import { exportGeneralExcel } from "../utils/exportGeneralExcel";
import { authFetch } from "../services/authFetch";
import { API_BASE } from "../config/api";
import ExportExcelModal from "../components/common/ExportExcelModal";

export default function General() {
    const [leads, setLeads] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [lines, setLines] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [origines, setOrigines] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [priorities, setpriorities] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showExportModal, setShowExportModal] = useState(false);
    const [fileName, setFileName] = useState("Reporte General");
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();

    const origin = searchParams.get("origin");
    const line = searchParams.get("line");
    const category = searchParams.get("category");

    function mapOrigin(origin: string | null) {
        if (origin === "pauta") return "1";
        if (origin === "organico") return "2";
        return null;
    }

    function handleOpenExport() {
        setFileName("Reporte General");
        setShowExportModal(true);
      }
    
      function handleConfirmExport() {
        exportGeneralExcel(
          filteredLeads,
          customers,
          contacts,
          countries,
          cities,
          lines,
          categories,
          origines,
          states,
          priorities,
          users,
          fileName
        );
        setShowExportModal(false);
      }

    useEffect(() => {
        const load = async () => {
            try {
                const [
                    leadsData,
                    customersData,
                    contactsData,
                    countriesData,
                    citiesData,
                    linesData,
                    categoryData,
                    originesData,
                    prioritiesData,
                    statesData,
                    userData,
                ] = await Promise.all([
                    authFetch(`${API_BASE}/lead`),
                    authFetch(`${API_BASE}/customer`),
                    authFetch(`${API_BASE}/contact`),
                    authFetch(`${API_BASE}/country`),
                    authFetch(`${API_BASE}/city`),
                    authFetch(`${API_BASE}/line`),
                    authFetch(`${API_BASE}/category`),
                    authFetch(`${API_BASE}/origin`),
                    authFetch(`${API_BASE}/priority`),
                    authFetch(`${API_BASE}/state`),
                    authFetch(`${API_BASE}/user`),
                ]);

                let lista = (leadsData || []).map((lead: any) => {
                    return {
                        ...lead,
                        activities: lead.activities ? JSON.parse(lead.activities) : [],
                    };
                });

                if (origin) {
                    const mapped = mapOrigin(origin);
                    if (mapped) {
                        lista = lista.filter((l: any) => String(l.originId) === mapped);
                    }
                }

                if (line) {
                    lista = lista.filter((l: any) => String(l.lineId) === String(line));
                }

                if (category) {
                    lista = lista.filter(
                        (l: any) => String(l.categoryId) === String(category)
                    );
                }

                setLeads(lista);
                setCustomers(customersData || []);
                setCountries(countriesData || []);
                setCities(citiesData || []);
                setContacts(contactsData || []);
                setLines(linesData || []);
                setCategories(categoryData || []);
                setOrigines(originesData || []);
                setStates(statesData || []);
                setpriorities(prioritiesData || []);
                setUsers(userData || []);
            } catch (err) {
                console.error("Error cargando datos generales:", err);

                setLeads([]);
                setCustomers([]);
                setCountries([]);
                setCities([]);
                setContacts([]);
                setLines([]);
                setCategories([]);
                setOrigines([]);
                setStates([]);
                setpriorities([]);
                setUsers([]);
            }
        };

        load();
    }, [origin, line, category]);

    const filteredLeads = useMemo(() => {
        if (!leads.length) return [];

        const start = startDate ? new Date(startDate + "T00:00:00") : null;
        const end = endDate ? new Date(endDate + "T23:59:59.999") : null;

        return leads.filter((lead) => {
            const customer = customers.find(
                (c) => Number(c.id) === Number(lead.customerId)
            );

            const matchesSearch =
                !search.trim() ||
                String(lead.id).includes(search) ||
                customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                String(lead.billing).includes(search) ||
                String(lead.cotization).includes(search) ||
                String(lead.codOV).includes(search);

            const activities = Array.isArray(lead.activities) ? lead.activities : [];
            const activity = activities.find((a: any) => a.activityTypeId === 1);

            let matchesDate = true;

            if (activity && (start || end)) {
                const leadDate = new Date(activity.createdAt);

                if (start && leadDate < start) return false;
                if (end && leadDate > end) return false;
            }

            return matchesSearch && matchesDate;
        });
    }, [leads, customers, search, startDate, endDate]);

    return (
        <>
            <PageMeta
                title="Facturado | CRM Demetalicos SAS"
                description="Reporte General"
            />

            <PageBreadcrumb pageTitle="Reporte General" />

            <ActionLineList
                value={search}
                onChange={setSearch}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onExportExcel={handleOpenExport}
            />

            <div className="space-y-6 mt-60 md:mt-56 px-2 md:px-10">
                <TableGeneral leads={filteredLeads} customers={customers} />
            </div>

            <ExportExcelModal
                open={showExportModal}
                fileName={fileName}
                setFileName={setFileName}
                onClose={() => setShowExportModal(false)}
                onConfirm={handleConfirmExport}
            />
        </>
    );
}