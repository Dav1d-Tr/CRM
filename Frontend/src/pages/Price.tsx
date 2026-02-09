// src/pages/Price.tsx
import { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ActionLineList from "../components/common/ActionLineList";
import PageMeta from "../components/common/PageMeta";
import TablePrice from "../components/tables/BasicTables/TablePrice";
import { useSearchParams } from "react-router-dom";
import { exportPriceExcel } from "../utils/exportPriceExcel";
import { API_BASE } from "../config/api";
import { authFetch } from "../services/authFetch";
import ExportExcelModal from "../components/common/ExportExcelModal";

export default function Price() {
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [origines, setOrigines] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [fileName, setFileName] = useState("Cotizados");
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
      setFileName("Cotizados");
      setShowExportModal(true);
    }
  
    function handleConfirmExport() {
      exportPriceExcel(
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
    Promise.all([
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
    ])
      .then(
        ([
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
        ]) => {
          let cotizados = (leadsData || [])
            .filter((l: any) => l.cotization && l.quotedValue && l.stateId !== 8)
            .map((l: any) => ({
              ...l,
              activities: l.activities ? JSON.parse(l.activities) : [],
            }));

          // Filtro por origin
          if (origin) {
            const mapped = mapOrigin(origin);
            if (mapped) {
              cotizados = cotizados.filter(
                (l: any) => String(l.originId) === mapped
              );
            }
          }

          // Filtro por line
          if (line) {
            cotizados = cotizados.filter(
              (l: any) => String(l.lineId) === String(line)
            );
          }

          // Filtro por category
          if (category) {
            cotizados = cotizados.filter(
              (l: any) => String(l.categoryId) === String(category)
            );
          }

          setLeads(cotizados);
          setCustomers(customersData || []);
          setCountries(countriesData || []);
          setCities(citiesData || []);
          setContacts(contactsData || []);
          setLines(linesData || []);
          setCategories(categoryData || []);
          setOrigines(originesData || []);
          setStates(statesData || []);
          setPriorities(prioritiesData || []);
          setUsers(userData || []);
        }
      )
      .catch((err) => {
        console.error("Error cargando datos:", err);
      });
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

      // Tomamos la actividad de tipo 9 (fecha de cotización)
      const activities = Array.isArray(lead.activities)
        ? lead.activities
        : [];
      const activity = activities.find((a: any) => a.activityTypeId === 9);
      if (!activity) return false; // descartamos si no hay actividad

      const leadDate = new Date(activity.createdAt);
      const matchesStart = !start || leadDate >= start;
      const matchesEnd = !end || leadDate <= end;
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [leads, customers, search, startDate, endDate]);

  return (
    <>
      <PageMeta
        title="Cotizado | CRM Demetalicos SAS"
        description="Listado de cotizaciones"
      />

      <PageBreadcrumb pageTitle="Cotizado" />

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
        <TablePrice leads={filteredLeads} customers={customers} />
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