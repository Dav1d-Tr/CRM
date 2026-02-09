// src/components/billing/BillingInformation.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageBreadCrumbBilling from "../common/PageBreadCrumbBilling";
import PageMeta from "../common/PageMeta";
import { API_BASE } from "../../config/api";
import { authFetch } from "../../services/authFetch";

/* ================= HELPERS ================= */

const safe = (v: any) => (v === null || v === undefined || v === "" ? "-" : v);

const safeDate = (d: any) => (d ? new Date(d).toLocaleString("es-CO") : "-");

const safeMoney = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = typeof v === "number" ? v : Number(v);
  if (isNaN(n)) return "-";
  return n.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const avatarUrl = (name?: string, lastName?: string) => {
  const seed = `${name ?? ""} ${lastName ?? ""}`.trim() || "User";
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    seed
  )}`;
};

const getActivityDate = (lead: any, activityTypeId: number) => {
  if (!lead?.activities || !Array.isArray(lead.activities)) return null;
  const act = lead.activities.find(
    (a: any) => a.activityTypeId === activityTypeId
  );
  return act?.createdAt || null;
};

/* ================= COMPONENTE ================= */

export default function BillingDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const lead = await authFetch(`${API_BASE}/lead/${id}`);
        if (!lead) return;
        if (lead.activities && typeof lead.activities === "string") {
          try {
            lead.activities = JSON.parse(lead.activities);
          } catch (e) {
            console.error("No se pudo parsear activities", e);
            lead.activities = [];
          }
        }

        const [customer, line, category, origin, comments] = await Promise.all([
          lead.customerId
            ? authFetch(`${API_BASE}/customer/${lead.customerId}`)
            : null,

          lead.lineId ? authFetch(`${API_BASE}/line/${lead.lineId}`) : null,
          lead.categoryId
            ? authFetch(`${API_BASE}/category/${lead.categoryId}`)
            : null,
          lead.originId ? authFetch(`${API_BASE}/origin/${lead.originId}`) : null,
          authFetch(`${API_BASE}/comment/lead/${id}`) || [],
        ]);

        const [country, city] = await Promise.all([
          customer?.countryId
            ? authFetch(`${API_BASE}/country/${customer.countryId}`)
            : null,
          customer?.cityId
            ? authFetch(`${API_BASE}/city/${customer.cityId}`)
            : null,
        ]);

        /* ===== CONTACTOS ===== */
        const contacts = customer?.id
          ? (await authFetch(
            `${API_BASE}/contact/customer/${customer.id}/all`
          )) || []
          : [];

        setData({
          lead,
          customer,
          contacts: Array.isArray(contacts) ? contacts : [],
          country,
          city,
          line,
          category,
          origin,
          comments: Array.isArray(comments) ? comments : [],
        });
      } catch (err) {
        console.error("Error cargando detalle de facturación", err);
      }
    };
    load();
  }, [id]);

  if (!data) {
    return <div className="mt-40 px-10">Cargando información…</div>;
  }

  const { lead, customer, contacts, country, city, line, category, origin, comments } =
    data;

  return (
    <>
      <PageMeta
        title={`Facturado | Caso #${lead.id}`}
        description="Detalle de facturación"
      />
      <PageBreadCrumbBilling
        pageTitle={`Caso # ${lead.id} - ${safe(customer?.name)}`}
      />
      <div className="space-y-6 mt-28 lg:mt-36 px-4 lg:px-10">
        <div className="bg-[#8e1a32] py-3 px-5 rounded-2xl">
          <strong className="text-base lg:text-2xl font-semibold text text-white">
            Infromación Principal
          </strong>
        </div>

        <Section title="Datos del Caso">
          <Item label="Caso: " value={`# ${lead.id}`} />
          <Item label="Fecha: " value={safeDate(getActivityDate(lead, 1))} />
          <Item label="Origen: " value={safe(origin?.name)} />
          <Item label="Línea: " value={safe(line?.name)} />
          <Item label="Tipo de Producto: " value={safe(category?.name)} />
        </Section>

        <Section title="Datos del Cliente">
          <Item label="Cliente: " value={safe(customer?.name)} />
          <Item label="Código: " value={safe(customer?.id)} />
          <Item label="País: " value={safe(country?.name)} />
          <Item label="Ciudad: " value={safe(city?.name)} />
        </Section>

        <Section title="Datos de Contacto">
          {contacts.length === 0 && (
            <span className="opacity-60">Sin contactos registrados</span>
          )}
          {contacts.map((c: any, index: number) => (
            <div key={c.id ?? index}
              className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-5 border-b-2 pb-4 mb-2 last:border-none border-[#8e1a32]">
              <Item label="Codigo: " value={safe(c.id)} />
              <Item label="Nombre: " value={safe(c.name)} />
              <Item label="Celular: " value={"+" + safe(country?.prefix) + " " + safe(c.numberPhone)} />
              <Item label="Correo: " value={safe(c.email)} />
            </div>
          ))}
        </Section>

        <section className="section grid gap-y-4 py-5 rounded-2xl border bg-white dark:text-gray-50 border-gray-500 dark:border-gray-600 dark:bg-gray-950 px-5 md:p-6">
          <strong className="text-lg">Descripción</strong>
          <p className="px-2 lg:px-8">{safe(lead.observations)}</p>
        </section>

        <div className="bg-[#8e1a32] py-3 px-5 rounded-2xl">
          <strong className="text-base lg:text-2xl font-semibold text text-white">
            Infromación Del Seguimiento
          </strong>
        </div>

        <Section title="Cotización">
          <Item label="Código: " value={safe(lead.cotization)} />
          <Item label="Valor: " value={safeMoney(lead.quotedValue)} />
          <Item label="Fecha: " value={safeDate(getActivityDate(lead, 9))} />
        </Section>

        <Section title="OV">
          <Item label="Código: " value={safe(lead.codOV)} />
          <Item label="Fecha: " value={safeDate(lead.dateOV)} />
        </Section>

        <Section title="Facturación">
          <Item label="Código: " value={safe(lead.billing)} />
          <Item label="Valor: " value={safeMoney(lead.billingValue)} />
          <Item label="Fecha: " value={safeDate(getActivityDate(lead, 11))} />
        </Section>

        <Section title="Fechas de Ingreso a las Etapas">
          <Item
            label="Cotización: "
            value={safeDate(getActivityDate(lead, 9))}
          />
          <Item
            label="Ingeniería: "
            value={safeDate(getActivityDate(lead, 3))}
          />
          <Item
            label="Seguimiento: "
            value={safeDate(getActivityDate(lead, 4))}
          />
          <Item label="Kick-Off: " value={safeDate(getActivityDate(lead, 5))} />
          <Item label="OV: " value={safeDate(getActivityDate(lead, 6))} />
          <Item
            label="Facturación: "
            value={safeDate(getActivityDate(lead, 7))}
          />
        </Section>

        <div className="bg-[#8e1a32] py-3 px-5 rounded-2xl flex items-center gap-4 text-white">
          <strong className="text-base lg:text-2xl font-semibold">
            Comentarios
          </strong>
          <span className="bg-gray-950 rounded-2xl p-1 px-3">
            {comments.length}
          </span>
        </div>

        <section className="section">
          <div className="space-y-3">
            {comments.map((c: any) => (
              <article
                key={c.id}
                className="rounded-2xl border p-4 flex gap-3 items-start border-gray-500 bg-white dark:text-gray-50 dark:border-gray-600 dark:bg-gray-950"
              >
                {/* AVATAR */}
                <img
                  src={avatarUrl(c.name, c.lastName)}
                  alt="avatar"
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
                />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <strong className="text-sm lg:text-lg">
                      {safe(c.name)} {safe(c.lastName)}
                    </strong>
                    <small className="text-xs lg:text-base opacity-70">
                      {safeDate(c.day)}
                    </small>
                  </div>

                  <p className="text-xs">{safe(c.observations)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/* ================= AUX ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section grid gap-y-4 py-5 rounded-2xl border dark:text-gray-50 border-gray-500 dark:border-gray-600 dark:bg-gray-950 bg-white px-5 md:p-6">
      <strong className="text-base lg:text-lg">{title}</strong>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-2 px-2 lg:px-8">
        {children}
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="text-base lg:text-lg flex gap-4">
      <strong>{label}</strong>
      <span>{value ?? "-"}</span>
    </div>
  );
}
