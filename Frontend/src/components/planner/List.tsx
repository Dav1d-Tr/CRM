// src/components/planner/List.tsx
import { useEffect, useState } from "react";
import Modal from "../planner/Modal";
import CardLead from "./CardLead";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import { usePlanner } from "../../context/PlannerContext";
import Button from "../ui/button/Button";
import { Lead } from "../../pages/Planner";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";
import { v4 as uuidv4 } from "uuid";

import {
  UserIcon,
  ChatIcon,
  ContentPaste,
  Loop,
  TaskIcon,
  AddIcon,
  TrashBinIcon,
} from "../../icons";
import Checkbox from "../form/input/Checkbox";

interface ListProps {
  title: string;
  color: string;
  state: string;
  leads: Lead[];
  onDropLead: (leadId: string, newState: string) => void;
  onUpdateLead?: (updated: any) => void;
  forceOpenLead: Lead | null;
  onForceOpenConsumed?: () => void;
  customer?: any[];
}

export default function List({
  title,
  color,
  state,
  leads,
  onDropLead,
  onUpdateLead,
  forceOpenLead,
  onForceOpenConsumed,
  customer,
}: ListProps) {
  const { viewMode } = usePlanner();
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [origins, setOrigins] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [customerContacts, setCustomerContacts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [countryPrefix, setCountryPrefix] = useState("");
  const [, setCities] = useState<any[]>([]);
  const countryOptions = countries.map((c: any) => ({
    value: String(c.id),
    label: c.name,
  }));
  const [allCities, setAllCities] = useState<any[]>([]);
  const [citiesOptions, setCitiesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    name: "",
    endDate: "",
  });
  const formatThousands = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const [form, setForm] = useState<any>({
    id: "",
    observations: "",
    cancellationReason: "",
    codOV: "",
    dateLead: "",
    dateOV: "",
    dateQuoted: "",
    cotization: "",
    quotedValue: "",
    billing: "",
    billingValue: "",
    userId: "",
    engineeringUserId: "",
    stateId: "",
    priorityId: "",
    originId: "",
    lineId: "",
    categoryId: "",
    customerId: "",
    dateCanceled: "",
    customerName: "",
    countryId: "",
    cityId: "",
    contacts: Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      _isNew?: boolean;
      _deleted?: boolean;
    }>,
  });

  useEffect(() => {
    if (!selectedLead?.id || !open) return;

    const loadTasks = async () => {
      try {
        const data = await authFetch(`${API_BASE}/task/lead/${selectedLead.id}`);
        setTasks(data || []);
      } catch {
        setTasks([]);
      }
    };
    loadTasks();
  }, [selectedLead?.id, open, needsRefresh]);

  useEffect(() => {
    if (!form.lineId) {
      setCategories([]);
      setForm((f: any) => ({ ...f, categoryId: "" }));
      return;
    }
    authFetch(`${API_BASE}/category?lineId=${form.lineId}`)
      .then((data) => {
        setCategories(
          (data || []).map((c: any) => ({ ...c, id: String(c.id) }))
        );
      })
      .catch(() => setCategories([]));
  }, [form.lineId]);

  useEffect(() => {
    if (!forceOpenLead) return;
    if (String(forceOpenLead.state) !== String(state)) return;
    handleOpenModal(forceOpenLead);
    onForceOpenConsumed?.();
  }, [forceOpenLead]);

  useEffect(() => {
    if (!selectedLead?.id || !open) return;
    const loadComments = async () => {
      try {
        const data = await authFetch(`${API_BASE}/comment/lead/${selectedLead.id}`);
        setComments(data || []);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
        setComments([]);
      }
    };
    loadComments();
  }, [selectedLead?.id, open]);

  /* ===================== LOAD SELECTS (catalogs) ===================== */

  useEffect(() => {
    const loadCatalog = async (url: string, setter: any) => {
      try {
        const data = await authFetch(`${API_BASE}/${url}`);
        setter(
          (data || []).map((item: any) => ({
            ...item,
            id: String(item.id),
          }))
        );
      } catch (err) {
        console.error(`Error cargando catálogo ${url}:`, err);
        setter([]);
      }
    };
    loadCatalog("user", setUsers);
    loadCatalog("priority", setPriorities);
    loadCatalog("origin", setOrigins);
    loadCatalog("line", setLines);
    loadCatalog("state", setStates);
    if (!customer || customer.length === 0) {
      loadCatalog("customer", setCustomers);
    } else {
      setCustomers(customer.map((c: any) => ({ ...c, id: String(c.id) })));
    }
    loadCatalog("country", setCountries);
    loadCatalog("city", setCities);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await authFetch(`${API_BASE}/city`);
        setAllCities(Array.isArray(data) ? data : []);
      } catch {
        setAllCities([]);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!form.countryId) {
      setCitiesOptions([]);
      setForm((f: any) => ({ ...f, cityId: "" }));
      return;
    }

    const filtered = allCities.filter(
      (c) => String(c.countryId) === String(form.countryId)
    );

    const options = filtered.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));

    setCitiesOptions(options);

    if (
      form.cityId &&
      !filtered.some((c) => String(c.id) === String(form.cityId))
    ) {
      setForm((f: any) => ({ ...f, cityId: "" }));
    }
  }, [form.countryId, allCities]);

  /* ===================== DRAG & DROP ===================== */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    if (!leadId) return;
    onDropLead(leadId, state);
  };

  const handleCreateTask = async () => {
    if (!newTask.name || !newTask.endDate || !selectedLead?.id) return;
    try {
      await authFetch(`${API_BASE}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTask.name,
          starting: new Date().toISOString(),
          endDate: `${newTask.endDate}T23:59:59`,
          stateTaskId: 1,
          leadId: selectedLead.id,
        }),
      });
      setNewTask({ name: "", endDate: "" });
      setNeedsRefresh((v) => !v);
    } catch (err) {
      console.error("Error creando tarea:", err);
    }
  };

  const toggleTask = async (task: any) => {
    const newState = task.stateTaskId === 1 ? 2 : 1;
    const updated = await authFetch(`${API_BASE}/task/${task.id}/state`, {
      method: "PATCH",
      body: JSON.stringify({ stateTaskId: newState }),
    });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      setNeedsRefresh((v) => !v);
    }
  };

  /* ===================== MODAL ===================== */
  const handleOpenModal = (lead: Lead) => {
    const customer = customers.find(
      (c) => String(c.id) === String(lead.customerId),
    );
    setSelectedLead(lead);
    setOpen(true);
    setCustomerContacts([]);
    authFetch(`${API_BASE}/contact/customer/${lead.customerId}/all`)
      .then((data) => {
        setCustomerContacts(
          (data || []).map((c: any) => ({
            id: String(c.id),
            name: c.name ?? "",
            email: c.email ?? "",
            phone: c.numberPhone ?? c.phone ?? "",
            _isNew: false,
            _deleted: false,
          }))
        );
      })
      .catch(() => setCustomerContacts([]));
    setSelectedLead(lead);
    setForm({
      id: String(lead.id ?? ""),
      observations: String(lead.observations ?? ""),
      cancellationReason: String(lead.cancellationReason ?? ""),
      codOV: String(lead.codOV ?? ""),
      dateOV: lead.dateOV ? String(lead.dateOV).slice(0, 10) : "",
      cotization: String(lead.cotization ?? ""),
      quotedValue: lead.quotedValue
        ? formatThousands(String(lead.quotedValue))
        : "",
      billing: String(lead.billing ?? ""),
      billingValue: lead.billingValue
        ? formatThousands(String(lead.billingValue))
        : "",
      userId: String(lead.userId ?? ""),
      engineeringUserId: String(lead.engineeringUserId ?? ""),
      stateId: String(lead.stateId ?? ""),
      priorityId: String(lead.priorityId ?? ""),
      originId: String(lead.originId ?? ""),
      lineId: String(lead.lineId ?? ""),
      categoryId: String(lead.categoryId ?? ""),
      customerId: String(lead.customerId ?? ""),
      customerName: customer?.name ?? "",
      countryId: String(customer?.countryId ?? ""),
      cityId: String(customer?.cityId ?? ""),
    });
    const customerCountry = countries.find(
      (c) => String(c.id) === String(customer?.countryId)
    );
    setCountryPrefix(customerCountry?.prefix ?? "");
    setOpen(true);
    setNeedsRefresh(false);
  };

  const handleSaveComment = async () => {
    const authUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!newComment.trim() || !selectedLead?.id || !authUser.id) return;
    try {
      await authFetch(`${API_BASE}/comment`, {
        method: "POST",
        body: JSON.stringify({
          observations: newComment,
          leadId: Number(selectedLead.id),
          userId: Number(authUser.id),
        }),
      });
      const data = await authFetch(`${API_BASE}/comment/lead/${selectedLead.id}`);
      setComments(data || []);
      setNewComment("");
      setNeedsRefresh((v) => !v);
    } catch (err) {
      console.error("Error guardando comentario:", err);
    }
  };

  /* ===================== SAVE ===================== */
  const handleSave = async () => {
    if (!form.id || !selectedLead) {
      console.error("No hay lead seleccionado");
      return;
    }

    if (!form.id) {
      console.error("No hay ID de lead para actualizar");
      return;
    }

    try {
      /* ===================== CUSTOMER ===================== */
      const customer = customers.find(
        (c) => String(c.id) === String(form.customerId),
      );
      const customerChanged =
        customer &&
        (String(customer.name ?? "") !== String(form.customerName ?? "") ||
          String(customer.countryId ?? "") !== String(form.countryId ?? "") ||
          String(customer.cityId ?? "") !== String(form.cityId ?? ""));
      if (customerChanged && form.customerId) {
        await authFetch(`${API_BASE}/customer/${form.customerId}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...(form.customerName ? { name: form.customerName } : {}),
            ...(form.countryId ? { countryId: Number(form.countryId) } : {}),
            ...(form.cityId ? { cityId: Number(form.cityId) } : {}),
          }),
        });
      }

      /* ===================== CONTACTS ===================== */

      for (const ct of customerContacts) {
        if (ct._deleted && ct.id) {
          await authFetch(`${API_BASE}/contact/${ct.id}`, {
            method: "DELETE",
          });
          continue;
        }
        if (ct._isNew && !ct._deleted && (ct.name || ct.phone || ct.email)) {
          await authFetch(`${API_BASE}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: ct.id,
              customerId: form.customerId,
              name: ct.name,
              email: ct.email,
              numberPhone: ct.phone,
            }),
          });
          continue;
        }
        if (!ct._isNew && ct.id && !ct._deleted) {
          await authFetch(`${API_BASE}/contact/${ct.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: ct.name || null,
              email: ct.email || null,
              numberPhone: ct.phone || null,
            }),
          });
        }
      }

      /* ===================== LEAD ===================== */

      const payload: any = {};
      const cotizationJustEntered =
        form.cotization && !selectedLead?.cotization;
      const ovJustEntered = form.codOV && !selectedLead?.codOV;
      const billingJustEntered = form.billing && !selectedLead?.billing;

      if (cotizationJustEntered) {
        payload.dateQuoted = new Date().toISOString();
        await createActivity("ADMIN_PRICE", form.id);
      }

      if (ovJustEntered) {
        payload.dateOV = new Date().toISOString();
        await createActivity("ADMIN_OV", form.id);
      }

      if (billingJustEntered) {
        payload.dateBilling = new Date().toISOString();
        await createActivity("ADMIN_BILLED", form.id);
      }

      if (typeof form.observations !== "undefined")
        payload.observations = form.observations || null;
      if (typeof form.cancellationReason !== "undefined")
        payload.cancellationReason = form.cancellationReason || null;
      if (typeof form.codOV !== "undefined") payload.codOV = form.codOV || null;
      if (typeof form.cotization !== "undefined")
        payload.cotization = form.cotization || null;
      if (typeof form.billing !== "undefined")
        payload.billing = form.billing || null;

      payload.quotedValue =
        form.quotedValue !== "" && form.quotedValue !== null
          ? Number(String(form.quotedValue).replace(/\./g, ""))
          : null;
      payload.billingValue =
        form.billingValue !== "" && form.billingValue !== null
          ? Number(String(form.billingValue).replace(/\./g, ""))
          : null;

      if (form.dateOV) {
        payload.dateOV = `${form.dateOV}T00:00:00`;
      }

      if (form.userId) payload.userId = form.userId;

      payload.stateId = form.stateId
        ? Number(form.stateId)
        : (selectedLead?.stateId ?? null);

      if (form.engineeringUserId) payload.engineeringUserId = form.engineeringUserId;

      payload.engineeringUserId = form.engineeringUserId
        ? Number(form.engineeringUserId)
        : (selectedLead?.engineeringUserId ?? null);

      if (form.priorityId) payload.priorityId = Number(form.priorityId);
      if (form.originId) payload.originId = Number(form.originId);
      if (form.lineId) payload.lineId = Number(form.lineId);
      if (form.categoryId) payload.categoryId = Number(form.categoryId);

      const updatedLeadFromServer = await authFetch(`${API_BASE}/lead/${form.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (updatedLeadFromServer) {
        const normalized: any = {
          id: String(updatedLeadFromServer.id ?? form.id),
          ...payload,
          state: updatedLeadFromServer.state ?? selectedLead?.state,
          customerId: updatedLeadFromServer.customerId ?? form.customerId,
        };
        if (typeof onUpdateLead === "function") {
          onUpdateLead(normalized);
        } else {
          setSelectedLead((prev) => ({ ...(prev ?? {}), ...normalized }));
        }
      } else {
        setSelectedLead((prev) => ({ ...(prev ?? {}), ...payload }));
        if (typeof onUpdateLead === "function") {
          onUpdateLead({ id: form.id, ...payload });
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Error en handleSave:", err);
    }
  };

  /* ===================== MAP TO SELECT (helper) ===================== */

  const toOptions = (arr: any[]) =>
    (arr || []).map((item: any) => ({
      value: String(item.id),
      label: item.name ?? item.nombre ?? item.title ?? String(item.id),
    }));
  const toUserOptions = (arr: any[]) =>
    (arr || []).map((u: any) => ({
      value: String(u.id),
      label: `${u.name ?? ""} ${u.lastName ?? ""}`.trim(),
    }));

  /* ===================== HELPERS: selected customer/contact ===================== */
  const createActivity = async (activityTypeCode: string, leadId: string) => {
    await authFetch(`${API_BASE}/activity/by-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: activityTypeCode,
        leadId: String(leadId),
        userId: String(form.userId || selectedLead?.userId),
      }),
    });
  };

  const getCommentUserName = (c: any) =>
    `${c.name ?? ""} ${c.lastName ?? ""}`.trim() || "Usuario";

  const getCommentAvatar = (c: any) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      getCommentUserName(c),
    )}`;

  const getCustomerName = (customerId?: string) => {
    const customer = customers.find((c) => String(c.id) === String(customerId));
    return customer?.name ?? "Cliente desconocido";
  };

  const getUserFullName = (userId?: string) => {
    const u = users.find((x) => String(x.id) === String(userId));
    return u ? `${u.name ?? ""} ${u.lastName ?? ""}`.trim() : "Usuario";
  };

  const getUserAvatar = (userId?: string) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      getUserFullName(userId),
    )}`;

  const engineeringUsers = users.filter(
    (u) => String(u.roleId) === "5"
  );

  /* ===================== RENDER ===================== */
  return (
    <div className="relative w-full">
      <article
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          flex flex-col
          rounded-2xl border border-gray-500 bg-white/[0.04] overflow-hidden
          ${viewMode === "columns" ? "h-[calc(100vh-16rem)] w-2xs" : "w-full"}
        `}
      >

        <div
          style={{ backgroundColor: `#${color}` }}
          className={`
            sticky top-0 z-2
            px-5 py-3
            ${viewMode === "columns" ? "lg:text-center" : "text-start"}
          `}
        >
          <strong className="text-lg text-white">{title}</strong>
        </div>

        <section className="
          flex-1
          flex flex-col gap-3 p-3
          overflow-y-auto
          scrollbar-hide
        ">
          {leads.map((lead) => (
            <div
              key={String(lead.id)}
              onClick={() => handleOpenModal(lead)}
              className="cursor-pointer"
            >
              <CardLead
                id={String(lead.id)}
                codeCustomer={String(lead.customerId)}
                customer={getCustomerName(lead.customerId)}
                priorityId={String(lead.priorityId ?? "")}
                lineId={String(lead.lineId ?? "")}
                originId={String(lead.originId ?? "")}
                codePrice={String(lead.cotization ?? "")}
                valuePrice={String(lead.quotedValue ?? "")}
                ownerAvatar={getUserAvatar(lead.userId)}
                ownerName={getUserFullName(lead.userId)}
                onOpen={() => handleOpenModal(lead)}
              />
            </div>
          ))}
        </section>
      </article>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          if (needsRefresh) {
            window.location.reload();
          }
        }}
      >
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white/90">
          Información del Lead
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* TABS */}
          <div className="flex border-b border-gray-500 mb-4">
            {[
              {
                id: "info",
                label: "Información Principal",
                icon: ContentPaste,
              },
              { id: "customer", label: "Datos Del Cliente", icon: UserIcon },
              { id: "seguimiento", label: "Seguimiento", icon: Loop },
              { id: "comentarios", label: "Comentarios", icon: ChatIcon },
              { id: "task", label: "Tareas", icon: TaskIcon },
            ].map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-0.5 px-3 py-2 text-sm font-medium transition
                  ${activeTab === tab.id
                      ? "border-b-2 border-[#8e1a32] text-[#8e1a32]"
                      : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                  <Icon className="w-7 h-5 max-lg:lg:hidden" />

                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB INFO */}
          {activeTab === "info" && (
            <section className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
              <div>
                <Label># Lead</Label>
                <Input
                  type="number"
                  placeholder="Lead"
                  value={form.id}
                  onChange={(v) => setForm({ ...form, id: v })}
                />
              </div>

              <div>
                <Label># Cliente</Label>
                <Input
                  type="number"
                  value={form.customerId}
                  onChange={(value) => setForm({ ...form, customerId: value })}
                />
              </div>

              <div>
                <Label>Nombre del Cliente</Label>
                <Input
                  type="text"
                  placeholder="Nombre Del Cliente"
                  value={form.customerName.toUpperCase()}
                  onChange={(value) =>
                    setForm({ ...form, customerName: value })
                  }
                />
              </div>

              <div>
                <Label>Encargado</Label>
                <Select
                  options={toUserOptions(users)}
                  value={form.userId}
                  placeholder="Usuario"
                  onChange={(v) => setForm({ ...form, userId: v })}
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  options={toOptions(states)}
                  value={String(form.stateId ?? "")}
                  placeholder="Estado"
                  onChange={(v) => setForm({ ...form, stateId: v })}
                />
              </div>

              <div>
                <Label>Prioridad</Label>
                <Select
                  options={toOptions(priorities)}
                  value={String(form.priorityId ?? "")}
                  placeholder="Prioridad"
                  onChange={(v) => setForm({ ...form, priorityId: v })}
                />
              </div>

              <div>
                <Label>Origen</Label>
                <Select
                  options={toOptions(origins)}
                  value={String(form.originId ?? "")}
                  placeholder="Origen"
                  onChange={(v) => setForm({ ...form, originId: v })}
                />
              </div>

              <div>
                <Label>Linea</Label>
                <Select
                  options={toOptions(lines)}
                  value={String(form.lineId ?? "")}
                  placeholder="Linea"
                  onChange={(v) => {
                    setForm((prev: any) => ({
                      ...prev,
                      lineId: v,
                      categoryId: "",
                    }));
                  }}
                />
              </div>

              <div>
                <Label>Categoría</Label>
                <Select
                  options={toOptions(categories)}
                  value={String(form.categoryId ?? "")}
                  placeholder="Categoría"
                  onChange={(v) => setForm({ ...form, categoryId: v })}
                />
              </div>

              {(String(form.stateId) != "1" && String(form.stateId) != "2") && (
                <div>
                  <Label>Ingeniero encargado</Label>
                  <Select
                    options={toUserOptions(engineeringUsers)}
                    value={form.engineeringUserId}
                    placeholder="Ingeniero"
                    onChange={(v) =>
                      setForm({ ...form, engineeringUserId: v })
                    }
                  />
                </div>
              )}

              <div className="lg:col-span-3">
                <Label>Descripción</Label>
                <TextArea
                  value={form.observations}
                  onChange={(value) =>
                    setForm({ ...form, observations: value })
                  }
                />
              </div>
            </section>
          )}

          {/* TAB 2 — Datos del Cliente */}
          {activeTab === "customer" && (
            <section>
              <div>
                <strong className="font-bold text-gray-800 dark:text-white/90 mb-5 block">
                  Datos del Cliente
                </strong>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div>
                    <Label># Cliente</Label>
                    <Input
                      type="number"
                      placeholder="Codigo Del Cliente"
                      value={form.customerId}
                      onChange={(value) =>
                        setForm({ ...form, customerId: value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Nombre del Cliente</Label>
                    <Input
                      type="text"
                      placeholder="Nombre Del Cliente"
                      value={form.customerName.toUpperCase()}
                      onChange={(value) =>
                        setForm({ ...form, customerName: value })
                      }
                    />
                  </div>

                  <div>
                    <Label>País</Label>
                    <Select
                      options={countryOptions}
                      value={form.countryId}
                      onChange={(v) => {
                        const selected = countries.find(
                          (c) => String(c.id) === String(v)
                        );

                        setForm((prev: any) => ({
                          ...prev,
                          countryId: v,
                          cityId: "",
                        }));

                        setCountryPrefix(selected?.prefix ?? "");
                      }}
                      placeholder="Seleccionar país"
                    />

                  </div>

                  <div>
                    <Label>Ciudad</Label>
                    <Select
                      options={citiesOptions}
                      value={form.cityId}
                      onChange={(v) =>
                        setForm((prev: any) => ({ ...prev, cityId: v }))
                      }
                      placeholder="Seleccionar ciudad"
                      disabled={!form.countryId}
                    />
                  </div>
                </div>

                <div className="h-0.5 bg-[#8e1a32] my-4 rounded-md"></div>

                <strong className="font-bold text-gray-800 dark:text-white/90 mb-5 block">
                  Información de contacto
                </strong>

                <div className="grid gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setCustomerContacts((prev) => [
                        ...prev,
                        {
                          _tmpId: uuidv4(),
                          id: "",
                          name: "",
                          email: "",
                          phone: "",
                          _isNew: true,
                          _deleted: false,
                        },
                      ]);
                    }}
                  >
                    <AddIcon /> Nuevo contacto
                  </Button>
                  <div className="grid gap-4">
                    {customerContacts
                      .filter((ct) => !ct._deleted)
                      .map((ct, index) => (
                        <div
                          key={ct._tmpId ?? ct.id}
                          className="grid grid-cols-1 gap-6 lg:grid-cols-3 p-2 rounded-lg"
                        >
                          <div>
                            <Label># Contacto</Label>
                            <Input
                              type="number"
                              value={ct.id}
                              onChange={(v) => {
                                setCustomerContacts((prev) =>
                                  prev.map((x, i) =>
                                    i === index ? { ...x, id: v } : x,
                                  ),
                                );
                              }}
                            />
                          </div>

                          <div>
                            <Label>Nombre</Label>
                            <Input
                              type="text"
                              value={ct.name}
                              onChange={(v) => {
                                setCustomerContacts((prev) =>
                                  prev.map((x, i) =>
                                    i === index ? { ...x, name: v } : x,
                                  ),
                                );
                              }}
                            />
                          </div>

                          <div>
                            <Label>Teléfono</Label>
                            <div className="relative">
                              <span className="absolute left-0 top-0 h-full flex items-center px-4 gap-1 text-amber-50 bg-[#b22948] rounded-l-md select-none z-10">
                                +{countryPrefix}
                              </span>

                              <Input
                                className="pl-20"
                                type="text"
                                value={ct.phone}
                                onChange={(v) => {
                                  const onlyNumbers = v.replace(/\D/g, "");
                                  setCustomerContacts((prev) =>
                                    prev.map((x, i) =>
                                      i === index ? { ...x, phone: onlyNumbers } : x,
                                    ),
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={ct.email}
                              onChange={(v) => {
                                setCustomerContacts((prev) =>
                                  prev.map((x, i) =>
                                    i === index ? { ...x, email: v } : x,
                                  ),
                                );
                              }}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setCustomerContacts((prev) =>
                                  prev.map((x, i) =>
                                    i === index ? { ...x, _deleted: true } : x,
                                  ),
                                );
                              }}
                            >
                              <TrashBinIcon />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "seguimiento" && (
            <section>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <Label># Cotización</Label>
                  <Input
                    type="number"
                    placeholder="Codigo Cotización"
                    value={form.cotization}
                    onChange={(value) =>
                      setForm({ ...form, cotization: value })
                    }
                  />
                </div>

                <div>
                  <Label>Valor De La Cotización</Label>
                  <Input
                    type="text"
                    placeholder="Valor De La Cotización"
                    value={form.quotedValue}
                    onChange={(value) => {
                      const formatted = formatThousands(value);
                      setForm({ ...form, quotedValue: formatted });
                    }}
                  />
                </div>

                <div>
                  <Label># Codigo OV</Label>
                  <Input
                    type="number"
                    placeholder="Codigo OV"
                    value={form.codOV}
                    onChange={(value) => setForm({ ...form, codOV: value })}
                  />
                </div>

                <div>
                  <Label>Fecha OV</Label>
                  <Input
                    type="date"
                    placeholder="Fecha OV"
                    value={form.dateOV}
                    onChange={(value) => setForm({ ...form, dateOV: value })}
                  />
                </div>

                <div>
                  <Label># Facturación</Label>
                  <Input
                    type="number"
                    placeholder="Codigo Facturación"
                    value={form.billing}
                    onChange={(value) => setForm({ ...form, billing: value })}
                  />
                </div>

                <div>
                  <Label>Valor De La Facturación</Label>
                  <Input
                    type="text"
                    placeholder="Valor De La Facturación"
                    value={form.billingValue}
                    onChange={(value) => {
                      const formatted = formatThousands(value);
                      setForm({ ...form, billingValue: formatted });
                    }}
                  />
                </div>

                {String(form.stateId) === "8" && (
                  <div className="lg:col-span-2">
                    <Label>Motivo de Cancelación</Label>
                    <TextArea
                      value={form.cancellationReason}
                      onChange={(value) =>
                        setForm({ ...form, cancellationReason: value })
                      }
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "comentarios" && (
            <section className="flex flex-col gap-4">
              <strong className="px-1 text-lg text-gray-800 dark:text-white/90">
                Nuevo Comentario
              </strong>

              <TextArea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(value) => setNewComment(value)}
              />

              <Button
                type="button"
                variant="primary"
                onClick={handleSaveComment}
                disabled={!newComment.trim()}
              >
                <AddIcon />
                Agregar comentario
              </Button>

              <div className="flex flex-col gap-3 mt-4">
                {comments.map((c) => (
                  <article
                    key={c.id}
                    className="rounded-2xl border border-gray-500 bg-white/[0.04] text-gray-800 dark:text-white/90 p-4 flex flex-col gap-2"
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img
                          src={getCommentAvatar(c)}
                          alt="avatar"
                          className="w-7 h-7 rounded-full bg-gray-200"
                        />

                        <strong className="text-sm">
                          {getCommentUserName(c)}
                        </strong>
                      </div>

                      <small className="text-xs opacity-70">
                        {new Date(
                          c.day ?? c.createdAt ?? c.date ?? Date.now(),
                        ).toLocaleString()}
                      </small>
                    </div>

                    <p className="pl-9 text-xs">{c.observations}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "task" && (
            <section className="flex flex-col gap-4">
              <strong className="px-1 text-lg text-gray-800 dark:text-white/90">
                Nueva Tarea
              </strong>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <Label>Nombre de la Tarea</Label>
                  <Input
                    type="text"
                    value={newTask.name}
                    onChange={(v) => setNewTask({ ...newTask, name: v })}
                  />
                </div>

                <div>
                  <Label>Fecha de Finalización</Label>
                  <Input
                    type="date"
                    value={newTask.endDate}
                    onChange={(v) => setNewTask({ ...newTask, endDate: v })}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleCreateTask}
              >
                <AddIcon />
                Agregar tarea
              </Button>

              <strong className="mt-4 px-1 text-lg text-gray-800 dark:text-white/90">
                Tareas Activas
              </strong>

              <div className="grid gap-1">
                {tasks.map((task) => (
                  <div key={task.id} className="px-6 py-2">
                    <Checkbox
                      label={task.name}
                      checked={task.stateTaskId === 2}
                      onChange={() => toggleTask(task)}
                      startDate={new Date(task.starting).toLocaleString(
                        "es-CO",
                      )}
                      endDate={new Date(task.endDate).toLocaleString("es-CO")}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <div
              className={`${activeTab === "comentarios" || activeTab === "task"
                ? "hidden"
                : "block"
                }`}
            >
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
            <div
              className={`${activeTab === "comentarios" || activeTab === "task"
                ? "hidden"
                : "block"
                }`}
            >
              <Button type="button" variant="primary" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
