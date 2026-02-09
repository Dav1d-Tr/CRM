// src/components/planner/CreateProspectModal.tsx
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { AddIcon, TrashBinIcon } from "../../icons";
import { API_BASE } from "../../config/api";
import Alert from "../../components/ui/alert/Alert";
import { authFetch } from "../../services/authFetch";

interface CreateProspectModalProps {
  open: boolean;
  onClose: () => void;
  onLeadCreated: (lead: any) => void;
}

interface ContactForm {
  code: string;
  name: string;
  phone: string;
  email: string;
}

export default function CreateProspectModal({
  open,
  onClose,
  onLeadCreated,
}: CreateProspectModalProps) {
  // Lead / Customer
  const [leadNumber, setLeadNumber] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [citiesOptions, setCitiesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [user, setUser] = useState("");
  const [state] = useState("1");
  const [priority, setPriority] = useState("");
  const [origin, setOrigin] = useState("");
  const [line, setLine] = useState("");
  const [description, setDescription] = useState("");
  const [countryPrefix, setCountryPrefix] = useState("");

  // Contactos múltiples
  const [contacts, setContacts] = useState<ContactForm[]>([
    { code: "", name: "", phone: "", email: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [usersOptions, setUsersOptions] = useState<any[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<any[]>([]);
  const [originOptions, setOriginOptions] = useState<any[]>([]);
  const [lineOptions, setLineOptions] = useState<any[]>([]);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string; prefix: string }[]
  >([]);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [, setAllCategories] = useState<any[]>([]);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
  } | null>(null);

  /* ================= LEADS ASIGNADOS ================= */

  /* ================= CATALOGOS ================= */
  useEffect(() => {
    const fetchCatalog = async (
      endpoint: string,
      setter: any,
      mapper?: (item: any) => { value: string; label: string }
    ) => {
      const data = await authFetch(`${API_BASE}/${endpoint}`);
      if (!Array.isArray(data)) {
        setter([]);
        return;
      }
      setter(
        mapper
          ? data.map(mapper)
          : data.map((i: any) => ({
            value: String(i.id),
            label: i.name,
          }))
      );
    };
    fetchCatalog("user", setUsersOptions, (u) => ({
      value: String(u.id),
      label: `${u.name} ${u.lastName}`,
    }));
    fetchCatalog("priority", setPriorityOptions);
    fetchCatalog("origin", setOriginOptions);
    fetchCatalog("line", setLineOptions);
    fetchCatalog("state", setStateOptions);
    fetchCatalog("country", setCountryOptions, (c) => ({
      value: String(c.id),
      label: c.name,
      prefix: c.prefix,
    }));
    fetchCatalog("category", setAllCategories);
  }, []);

  /* ================= CATEGORIAS ================= */

  useEffect(() => {
    const fetchCategories = async () => {
      if (!line) {
        setCategoryOptions([]);
        setCategory("");
        return;
      }

      try {
        const data = await authFetch(`${API_BASE}/category?lineId=${line}`);
        setCategoryOptions(
          (data || []).map((c: any) => ({
            value: String(c.id),
            label: c.name,
          }))
        );
      } catch (err) {
        console.error(err);
        setCategoryOptions([]);
      }
    };
    fetchCategories();
  }, [line]);

  /* ================= CIUDADES ================= */
  useEffect(() => {
    const fetchCities = async () => {
      if (!country) {
        setCitiesOptions([]);
        return;
      }

      try {
        const data = await authFetch(`${API_BASE}/city?countryId=${country}`);
        setCitiesOptions(
          (data || []).map((c: any) => ({
            value: String(c.id),
            label: c.name,
          }))
        );
      } catch (err) {
        console.error(err);
        setCitiesOptions([]);
      }
    };
    fetchCities();
  }, [country]);

  useEffect(() => {
    if (alertData) {
      const timer = setTimeout(() => setAlertData(null), 3000); // 5s
      return () => clearTimeout(timer);
    }
  }, [alertData]);

  /* ================= CONTACTOS ================= */
  const addContact = () =>
    setContacts([...contacts, { code: "", name: "", phone: "", email: "" }]);

  const removeContact = (index: number) =>
    setContacts(contacts.filter((_, i) => i !== index));

  const updateContact = (
    index: number,
    field: keyof ContactForm,
    value: string
  ) => {
    const copy = [...contacts];
    copy[index][field] = value;
    setContacts(copy);
  };

  const resetForm = () => {
    setLeadNumber("");
    setCustomerCode("");
    setCustomerName("");
    setCountry("");
    setCity("");
    setUser("");
    setPriority("");
    setOrigin("");
    setLine("");
    setDescription("");
    setContacts([{ code: "", name: "", phone: "", email: "" }]);
  };

  /* ================= GUARDAR ================= */
  const handleSave = async () => {
    const hasValidContact = contacts.some((c) => c.name && c.email);

    if (!user || !line || !category) {
      setAlertData({
        variant: "error",
        title: "Campos incompletos",
        message: "Faltan campos por llenar",
      });
      return;
    }

    // Revisar contactos
    const invalidContacts = contacts.filter(c => !c.name || !c.email);
    if (invalidContacts.length > 0) {
      setAlertData({
        variant: "error",
        title: "Contacto incompleto",
        message: `Por favor completa nombre y email de todos los contactos.`,
      });
      return;
    }

    if (!customerName || !country || !city || !hasValidContact) return;
    setLoading(true);

    try {
      const customerId = customerCode || `cust-${Date.now()}`;
      await authFetch(`${API_BASE}/customer`, {
        method: "POST",
        body: JSON.stringify({
          id: customerId,
          name: customerName,
          countryId: country,
          cityId: city,
        }),
      });

      const createdLead = await authFetch(`${API_BASE}/lead/`, {
        method: "POST",
        body: JSON.stringify({
          id: leadNumber || `lead-${Date.now()}`,
          observations: description,
          codOV: null,
          dateOV: null,
          cotization: null,
          quotedValue: null,
          billing: null,
          billingValue: null,
          userId: Number(user),
          stateId: Number(state),
          priorityId: priority ? Number(priority) : null,
          originId: origin ? Number(origin) : null,
          lineId: line ? Number(line) : null,
          categoryId: category ? Number(category) : null,
          customerId,
        }),
      });

      for (const c of contacts) {
        if (!c.name || !c.email) continue;

        await authFetch(`${API_BASE}/contact`, {
          method: "POST",
          body: JSON.stringify({
            id: c.code || `contact-${Date.now()}-${Math.random()}`,
            name: c.name,
            numberPhone: c.phone,
            email: c.email,
            customerId,
          }),
        });
      }

      setAlertData({
        variant: "success",
        title: "Lead creado",
        message: "El lead se creó correctamente",
      });
      onLeadCreated(createdLead);
      resetForm();
      onClose();
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
          showLink={alertData.showLink}
          linkHref={alertData.linkHref}
          linkText={alertData.linkText}
        />
      )}
      <h1 className="text-xl font-semibold mb-6 text-gray-700 text-start dark:text-white/90">
        Nueva Prospección
      </h1>

      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <Label># Caso</Label>
            <Input
              type="number"
              value={leadNumber}
              onChange={(value) => setLeadNumber(value)}
            />
          </div>

          <div>
            <Label>Código del Cliente</Label>
            <Input
              type="number"
              value={customerCode}
              onChange={(value) => setCustomerCode(value)}
            />
          </div>

          <div>
            <Label>Nombre del Cliente</Label>
            <Input
              type="text"
              value={customerName.toUpperCase()}
              onChange={(value) => setCustomerName(value)}
            />
          </div>

          <div>
            <Label>País</Label>
            <Select
              options={countryOptions}
              value={country}
              onChange={(v) => {
                setCountry(v);
                const selected = countryOptions.find((c) => c.value === v);
                setCountryPrefix(selected?.prefix || "");
              }}
              placeholder="Seleccionar país"
            />
          </div>

          <div>
            <Label>Ciudad</Label>
            <Select
              options={citiesOptions}
              value={city}
              onChange={(v) => setCity(v)}
              placeholder="Seleccionar ciudad"
            />
          </div>

          <div>
            <Label>Estado</Label>
            <Select
              options={stateOptions.filter((o) => o.value === "1")}
              value="1"
              onChange={() => { }}
            />
          </div>

          <div>
            <Label>Encargado</Label>
            <Select
              options={usersOptions}
              value={user}
              onChange={(v) => setUser(v)}
              placeholder="Seleccionar usuario"
            />
          </div>

          <div>
            <Label>Prioridad</Label>
            <Select
              options={priorityOptions}
              value={priority}
              onChange={(v) => setPriority(v)}
              placeholder="Seleccionar prioridad"
            />
          </div>

          <div>
            <Label>Origen</Label>
            <Select
              options={originOptions}
              value={origin}
              onChange={(v) => setOrigin(v)}
              placeholder="Seleccionar origen"
            />
          </div>

          <div>
            <Label>Linea</Label>
            <Select
              options={lineOptions}
              value={line}
              onChange={(v) => setLine(v)}
              placeholder="Seleccionar linea"
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <Select
              options={categoryOptions}
              value={category}
              onChange={(v) => setCategory(v)}
              placeholder="Seleccionar categoría"
            />
          </div>

          <div className="lg:col-span-3">
            <Label>Descripción</Label>
            <TextArea value={description} onChange={(v) => setDescription(v)} />
          </div>
        </div>

        <h2 className="mt-4 font-semibold text-gray-700 text-start dark:text-white/90">
          Contacto
        </h2>
        <div className=" grid gap-10">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded"
            >
              <div>
                <Label>Código del contacto</Label>
                <Input
                  type="number"
                  value={c.code}
                  onChange={(v) => updateContact(i, "code", v)}
                />
              </div>

              <div>
                <Label>Nombre del contacto</Label>
                <Input
                  type="text"
                  value={c.name}
                  onChange={(v) => updateContact(i, "name", v)}
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
                    type="number"
                    value={c.phone}
                    onChange={(v) =>
                      updateContact(i, "phone", v.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={c.email}
                  onChange={(v) => updateContact(i, "email", v)}
                />
              </div>

              {contacts.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeContact(i)}
                  className="lg:mt-6"
                >
                  <TrashBinIcon />
                  Eliminar
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="primary" onClick={addContact}>
          <AddIcon /> Agregar contacto
        </Button>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
