// Tengo un problema y es que no se me esta importando el archivo de excel que tengo y tiene todas las columnas como esta requerido: 
// src/pages/Planner.tsx
import { useEffect, useMemo, useState } from "react";
import { usePlanner } from "../context/PlannerContext";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ActionLine from "../components/common/ActionLine";
import PageMeta from "../components/common/PageMeta";
import List from "../components/planner/List";
import CreateProspectModal from "../components/planner/CreateProspectModal";
import Alert from "../components/ui/alert/Alert";
import { useSidebar } from "../context/SidebarContext";
import { API_BASE } from "../config/api";
import { authFetch } from "../services/authFetch";

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
}

export interface Lead {
  id: string;
  state: string;
  customerId: string;
  customer?: Customer;
  observations?: string;
  cancellationReason?: string;
  codOV?: string;
  dateOV: null;
  cotization?: string;
  quotedValue?: number;
  billing?: string;
  billingValue?: number;
  userId?: string;
  engineeringUserId?: string;
  stateId?: number;
  priorityId?: number;
  originId?: number;
  lineId?: number;
  categoryId?: number;
}

const stateMap: Record<string, number> = {
  prospeccion: 1,
  cotización: 2,
  ingenieria: 3,
  seguimiento: 4,
  "kick-off": 5,
  ov: 6,
  facturación: 7,
  cancelado: 8,
};

const stateReverseMap: Record<number, string> = Object.fromEntries(
  Object.entries(stateMap).map(([k, v]) => [v, k])
);

export default function Planner() {
  const { viewMode } = usePlanner();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [forceOpenLead, setForceOpenLead] = useState<Lead | null>(null);

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [openProspectModal, setOpenProspectModal] = useState(false);

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const sidebarWidth =
    (isHovered || isExpanded) && !isMobileOpen ? (window.innerWidth >= 1524) ? -80 : -40 : (window.innerWidth <= 1524) ? -135 : -280;

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === updated.id ? { ...lead, ...updated } : lead
      )
    );
  };

  /* ===================== Normalizador helper ===================== */
  const normalizeLead = (lead: any): Lead => {
    return {
      id: String(lead.id),
      customerId: String(lead.customerId ?? lead.customer?.id ?? ""),
      observations: lead.observations ?? "",
      cancellationReason: lead.cancellationReason ?? "",
      codOV: lead.codOV ?? lead.cod_ov ?? "",
      dateOV: lead.dateOV ?? null,
      cotization: lead.cotization ?? null,
      quotedValue:
        lead.quotedValue !== undefined && lead.quotedValue !== null
          ? Number(lead.quotedValue)
          : undefined,
      billing: lead.billing ?? null,
      billingValue:
        lead.billingValue !== undefined && lead.billingValue !== null
          ? Number(lead.billingValue)
          : undefined,
      userId: lead.userId ? String(lead.userId) : undefined,
      engineeringUserId: lead.engineeringUserId ? String(lead.engineeringUserId) : undefined,
      stateId:
        lead.stateId !== undefined && lead.stateId !== null
          ? Number(lead.stateId)
          : undefined,
      priorityId:
        lead.priorityId !== undefined && lead.priorityId !== null
          ? Number(lead.priorityId)
          : undefined,
      originId:
        lead.originId !== undefined && lead.originId !== null
          ? Number(lead.originId)
          : undefined,
      lineId:
        lead.lineId !== undefined && lead.lineId !== null
          ? Number(lead.lineId)
          : undefined,
      categoryId:
        lead.categoryId !== undefined && lead.categoryId !== null
          ? Number(lead.categoryId)
          : undefined,
      state:
        typeof lead.state === "string"
          ? lead.state
          : stateReverseMap[Number(lead.stateId)] ?? "prospeccion",
    };
  };

  /* ===================== Helper obtener userId seguro ===================== */
  const getUserIdFromStorage = (): string | null => {
    const raw = localStorage.getItem("userId");
    if (raw) return String(raw);
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;
    try {
      const u = JSON.parse(rawUser);
      if (u && (u.id || u.userId)) return String(u.id ?? u.userId);
    } catch {
      return null;
    }
    return null;
  };
  const getUserRoleFromStorage = (): string | null => {
    const rawRole = localStorage.getItem("userRole");
    if (rawRole) return String(rawRole);

    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    try {
      const u = JSON.parse(rawUser);
      if (u && u.roleId) return String(u.roleId);
    } catch {
      return null;
    }
    return null;
  };

  /* ===================== Crear actividad por code (centralizado) ===================== */
  const createActivityByCode = async (
    code: string,
    leadId: string,
    userId?: string
  ) => {
    const uid = userId ?? getUserIdFromStorage();
    if (!code || !leadId || !uid) return null;
    try {
      const data = await authFetch(`${API_BASE}/activity/by-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, leadId, userId: uid }),
      });
      return data;
    } catch (err) {
      console.error("createActivityByCode error:", err);
      return null;
    }
  };

  /* ===================== VALIDACIONES DE NEGOCIO ===================== */
  const validateStateChange = (
    lead: Lead,
    nextState: string
  ): string | null => {
    if (
      ["ingenieria", "seguimiento", "kick-off", "ov", "facturación"].includes(
        nextState
      )
    ) {
      if (!lead.cotization || !lead.quotedValue)
        return "Debes ingresar cotización y valor cotizado.";
    }
    if (nextState === "facturación") {
      if (!lead.codOV) return "Debes ingresar código OV y fecha OV.";
    }
    return null;
  };

  /* ===================== LOAD LEADS ===================== */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const userId = getUserIdFromStorage();
    const userRole = getUserRoleFromStorage();
    authFetch(`${API_BASE}/lead`)
      .then((data) => {
        if (!mounted) return;

        let normalized: Lead[] = (data || []).map((lead: any) =>
          normalizeLead(lead)
        );

        if (userRole === "4" && userId) {
          normalized = normalized.filter((lead) => lead.userId === userId);
        }
        if (userRole === "5" && userId) {
          normalized = normalized.filter(
            (lead) => lead.engineeringUserId === userId
          );
        }
        setLeads(normalized);
      })
      .catch((err) => console.error("Error cargando leads:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== Alert auto-hide ===================== */
  useEffect(() => {
    if (!alertData) return;
    const timer = setTimeout(() => setAlertData(null), 4000);
    return () => clearTimeout(timer);
  }, [alertData]);

  /* ===================== LOAD CUSTOMERS ===================== */

  useEffect(() => {
    let mounted = true;
    authFetch(`${API_BASE}/customer`)
      .then((data) => {
        if (!mounted) return;
        const normalized: Customer[] = (data || []).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          company: c.company,
          email: c.email,
          phone: c.numberPhone ?? c.phone ?? c.telefono ?? c.phoneNumber,
          country: c.country ?? (c.countryId ? String(c.countryId) : undefined),
          city: c.city ?? (c.cityId ? String(c.cityId) : undefined),
        }));
        setCustomers(normalized);
      })
      .catch((err) => console.error("Error cargando clientes:", err));
    return () => {
      mounted = false;
    };
  }, []);

  /* ===================== leads + customer join ===================== */
  const leadsWithCustomer = useMemo(() => {
    return leads.map((lead) => ({
      ...lead,
      customer: customers.find((c) => c.id === lead.customerId) ?? undefined,
    }));
  }, [leads, customers]);

  /* ===================== FILTRADO BUSCADOR ===================== */
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return leadsWithCustomer
      .filter((l) => {
        return (
          (l.id ?? "").toLowerCase().includes(q) ||
          (l.customer?.name ?? "").toLowerCase().includes(q) ||
          (l.observations ?? "").toLowerCase().includes(q) ||
          (l.codOV ?? "").toLowerCase().includes(q) ||
          (String(l.cotization ?? "") ?? "").toLowerCase().includes(q) ||
          (l.billing ?? "").toLowerCase().includes(q) ||
          (l.customerId ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [searchQuery, leadsWithCustomer]);

  /* ===================== handle new lead (desde modal) ===================== */
  const handleLeadCreated = (created: any) => {
    try {
      const newLead = normalizeLead(created);
      // si backend devolvió customer adjunto, agregar/actualizar customers
      if (created.customer) {
        const newCustomer: Customer = {
          id: String(created.customer.id),
          name: created.customer.name,
          company: created.customer.company,
          email: created.customer.email,
          phone: created.customer.numberPhone ?? created.customer.phone ?? "",
          country:
            created.customer.country ??
            (created.customer.countryId
              ? String(created.customer.countryId)
              : undefined),
          city:
            created.customer.city ??
            (created.customer.cityId
              ? String(created.customer.cityId)
              : undefined),
        };
        setCustomers((prev) => {
          const exists = prev.find((c) => c.id === newCustomer.id);
          if (exists)
            return prev.map((c) => (c.id === newCustomer.id ? newCustomer : c));
          return [newCustomer, ...prev];
        });
      }
      setLeads((prev) => [newLead, ...prev]);
    } catch (err) {
      console.error("Error normalizando lead creado:", err);
    }
  };

  /* ===================== handle drag & drop state change ===================== */
  const handleDropLead = async (leadId: string, newState: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const validationError = validateStateChange(lead, newState);
    if (validationError) {
      setAlertData({
        variant: "error",
        title: "Error al cambiar estado",
        message: validationError,
      });
      return;
    }
    const payload = { stateId: stateMap[newState] };
    const STATE_TO_ACTIVITY_CODE: Record<string, string> = {
      prospeccion: "CREATE",
      cotización: "PRICE",
      ingenieria: "ENGINEERING",
      seguimiento: "FOLLOW-UP",
      "kick-off": "KICK-OFF",
      ov: "OV",
      facturación: "BILLED",
      cancelado: "CANCELED",
    };
    setLeads((curr) =>
      curr.map((l) =>
        l.id === leadId ? { ...l, state: newState, ...payload } : l
      )
    );
    try {
      await authFetch(`${API_BASE}/lead/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const activityCode = STATE_TO_ACTIVITY_CODE[newState];
      if (activityCode) {
        await createActivityByCode(
          activityCode,
          leadId,
          lead.userId ?? undefined
        );
      }
    } catch (err) {
      console.error("handleDropLead error:", err);
      setAlertData({
        variant: "error",
        title: "Error del servidor",
        message:
          "No se pudo guardar el cambio de estado. Se revertirá el cambio en la UI.",
      });
      try {
        const data = await authFetch(`${API_BASE}/lead`);
        setLeads((data || []).map((l: any) => normalizeLead(l)));
      } catch (reloadErr) {
        console.error("Error recargando leads tras fallo:", reloadErr);
      }
    }
  };

  const lists = [
    { title: "Prospección", color: "c64a64", state: "prospeccion" },
    {
      title: "Comercial / En Cotización",
      color: "048b6f",
      state: "cotización",
    },
    { title: "Ingeniería", color: "ac5858", state: "ingenieria" },
    { title: "Seguimiento", color: "c3b880", state: "seguimiento" },
    { title: "Kick-Off", color: "039855", state: "kick-off" },
    { title: "OV", color: "ec4a0a", state: "ov" },
    { title: "Facturación", color: "3DE1D9", state: "facturación" },
    { title: "Perdido / Cancelado", color: "949C91", state: "cancelado" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando leads…
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Planificador | CRM Demetalicos SAS"
        description="React Tailwind Admin Dashboard"
      />
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
          showLink={false}
        />
      )}
      <div className="flex flex-col">
        <div className="flex lg:flex-col">
          <PageBreadcrumb pageTitle="Planificador" />
          <ActionLine
            value={searchQuery}
            onChange={setSearchQuery}
            results={filteredLeads}
            onSelectLead={(lead) => setForceOpenLead(lead)}
          />
        </div>
        <section
          style={viewMode === "list" ? undefined : { marginLeft: sidebarWidth }}
          className={
            viewMode === "columns"
              ? isExpanded || isHovered ? "flex gap-x-5 mt-52 px-20" : "w-full flex gap-x-5 mt-52 px-44"
              : "flex flex-col gap-10 mt-56 md:mt-60 px-2 lg:px-10"
          }
        >
          {lists.map((list) => (
            <List
              key={list.state}
              title={list.title}
              color={list.color}
              state={list.state}
              leads={leadsWithCustomer.filter(
                (lead) => lead.state === list.state
              )}
              onDropLead={handleDropLead}
              onUpdateLead={handleUpdateLead}
              forceOpenLead={forceOpenLead}
              onForceOpenConsumed={() => setForceOpenLead(null)}
            />
          ))}
        </section>
      </div>

      <CreateProspectModal
        open={openProspectModal}
        onClose={() => setOpenProspectModal(false)}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
}
