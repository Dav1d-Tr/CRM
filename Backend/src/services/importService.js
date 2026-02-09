// services/importService.js
import * as CountryService from "./countryService.js";
import * as CityService from "./cityService.js";
import * as StateService from "./stateService.js";
import * as LineService from "./lineService.js";
import * as CategoryService from "./categoryService.js";
import * as PriorityService from "./priorityService.js";
import * as OriginService from "./originService.js";
import * as contactService from "./contactService.js";
import * as leadService from "./leadService.js";

/**
 * Crea mapas { nombre_normalizado -> id } desde arrays de entidades.
 */
const toMap = (arr, nameKey = "name") =>
  new Map(arr.map(x => [String(x[nameKey]).toLowerCase().trim(), x.id]));

const preloadMaps = async () => {
  const [
    countries,
    cities,
    states,
    lines,
    categories,
    priorities,
    origins
  ] = await Promise.all([
    CountryService.getAllCountrys(),
    CityService.getAllCitys(),
    StateService.getAllState(),
    LineService.getAllLine(),
    CategoryService.getAllCategories(),
    PriorityService.getAllPriority(),
    OriginService.getAllOrigin()
  ]);

  return {
    countryMap: toMap(countries),
    cityMap: toMap(cities),
    stateMap: toMap(states),
    lineMap: toMap(lines),
    categoryMap: toMap(categories),
    priorityMap: toMap(priorities),
    originMap: toMap(origins)
  };
};

const normalizeString = (v) =>
  v === undefined || v === null ? "" : String(v).toLowerCase().trim();

/**
 * resolveOrThrow(map, value, fieldName)
 * Busca en map por value (normalizado). Lanza error si no existe.
 */
const resolveOrThrow = (map, value, field) => {
  const key = normalizeString(value);
  const id = map.get(key);
  if (!id) throw new Error(`${field} no encontrado: "${value}"`);
  return id;
};

/**
 * Mapeo de columnas del excel (header) a campos que espera el import.
 * Ajusta si tus headers difieren.
 */
const mapRowHeaders = (row) => {
  // row viene desde XLSX.utils.sheet_to_json: objeto { "Caso": "100", "Cliente": "X", ... }
  return {
    caso: row["Caso"] ?? row["caso"] ?? row["ID"] ?? row["Id"],
    codigoCliente: row["Código del cliente"] ?? row["Codigo del cliente"] ?? row["codigoCliente"],
    clienteNombre: row["Cliente"] ?? row["cliente"],
    pais: row["País"] ?? row["Pais"] ?? row["pais"],
    ciudad: row["Ciudad"] ?? row["ciudad"],
    encargado: row["Encargado"] ?? row["encargado"], // id de usuario
    estado: row["Estado"] ?? row["estado"],

    linea: row["Línea"] ?? row["Linea"] ?? row["linea"],
    producto: row["Producto"] ?? row["producto"],

    prioridad: row["Prioridad"] ?? row["prioridad"],
    origen: row["Origen"] ?? row["origen"],

    // opcionales
    cotizacion: row["Codigo de Cotización"] ?? row["Codigo Cotizacion"] ?? row["cotizacion"],
    valorCotizado: row["Valor cotizado"] ?? row["ValorCotizado"] ?? row["valorCotizado"],
    codOV: row["Código OV"] ?? row["Codigo OV"] ?? row["codOV"],
    dateOV: row["Fecha OV"] ?? row["FechaOV"] ?? row["dateOV"],
    codigoFactura: row["Código factura"] ?? row["Codigo factura"] ?? row["codigoFactura"],
    valorFacturado: row["Valor facturado"] ?? row["valorFacturado"],
    observaciones: row["Observaciones"] ?? row["observaciones"],

    // contacto (requeridos)
    contactoId: row["Codigo Contacto"] ?? row["CodigoContacto"] ?? row["contactoId"],
    contactoNombre: row["Nombre Contacto"] ?? row["NombreContacto"] ?? row["contactoNombre"],
    contactoCorreo: row["Correo Contacto"] ?? row["CorreoContacto"] ?? row["contactoCorreo"],
    contactoTelefono: row["Teléfono Contacto"] ?? row["Telefono Contacto"] ?? row["contactoTelefono"],
  };
};

/**
 * importLeads(rows)
 * rows: array de filas ya parseadas desde Excel (sheet_to_json)
 */
export const importLeads = async (rows) => {
  const maps = await preloadMaps();

  const results = {
    total: rows.length,
    success: [],
    errors: []
  };

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const rowNumber = i + 2; // asumiendo header en fila 1
    try {
      const r = mapRowHeaders(raw);

      // Validaciones requeridas (según lo que pediste)
      if (!r.caso) throw new Error("Caso (id del lead) es requerido");
      if (!r.codigoCliente && !r.clienteNombre) throw new Error("Código del cliente o Nombre del cliente requerido");
      if (!r.pais) throw new Error("País es requerido");
      if (!r.ciudad) throw new Error("Ciudad es requerido");
      if (!r.encargado) throw new Error("Encargado (userId) es requerido");

      // Estado/Línea/Producto/Prioridad/Origen son obligatorios como texto para resolver a ids
      if (!r.estado) throw new Error("Estado es requerido");
      if (!r.linea) throw new Error("Línea es requerida");
      if (!r.producto) throw new Error("Producto es requerido");
      if (!r.prioridad) throw new Error("Prioridad es requerida");
      if (!r.origen) throw new Error("Origen es requerido");

      // Contacto (requerido)
      if (!r.contactoId && !r.contactoCorreo && !r.contactoTelefono && !r.contactoNombre) {
        throw new Error("Datos de contacto incompletos");
      }
      if (!r.contactoNombre) throw new Error("Nombre contacto es requerido");
      if (!r.contactoCorreo) throw new Error("Correo contacto es requerido");
      if (!r.contactoTelefono) throw new Error("Teléfono contacto es requerido");

      // Resolver IDs desde nombres
      const countryId = resolveOrThrow(maps.countryMap, r.pais, "País");
      const cityId = resolveOrThrow(maps.cityMap, r.ciudad, "Ciudad");
      const stateId = resolveOrThrow(maps.stateMap, r.estado, "Estado");
      const lineId = resolveOrThrow(maps.lineMap, r.linea, "Línea");
      const categoryId = resolveOrThrow(maps.categoryMap, r.producto, "Producto");
      const priorityId = resolveOrThrow(maps.priorityMap, r.prioridad, "Prioridad");
      const originId = resolveOrThrow(maps.originMap, r.origen, "Origen");

      // Si no pasaron customerId pero pasaron clienteNombre: tratar de buscar customerId por nombre
      let customerId = r.codigoCliente ?? null;
      if (!customerId) {
        // buscar por nombre exacto en DB
        // asumimos customerService tiene getAllCustomer o searchCustomer
        const customers = await (await import("./customerService.js")).getAllCustomer();
        const found = customers.find(c => String(c.name).toLowerCase().trim() === String(r.clienteNombre).toLowerCase().trim());
        if (found) customerId = found.id;
        else throw new Error(`Cliente no encontrado: "${r.clienteNombre}". Pasa el ID o crea el cliente primero.`);
      }

      // Crear/actualizar contacto (si proporcionaron contactoId, lo respetamos)
      const contactPayload = {
        id: r.contactoId ?? null,
        name: r.contactoNombre,
        email: r.contactoCorreo,
        numberPhone: r.contactoTelefono,
        customerId
      };

      const createdContact = await contactService.createContact(contactPayload);

      // Preparar lead payload
      const leadPayload = {
        id: r.caso,
        observations: r.observaciones ?? null,
        cancellationReason: null,
        codOV: r.codOV ?? null,
        dateOV: r.dateOV ? new Date(r.dateOV) : null,
        cotization: r.cotizacion ?? null,
        quotedValue: r.valorCotizado ? Number(r.valorCotizado) : null,
        billing: r.codigoFactura ?? null,
        billingValue: r.valorFacturado ? Number(r.valorFacturado) : null,
        userId: r.encargado,
        engineeringUserId: null,
        stateId,
        priorityId,
        originId,
        lineId,
        categoryId,
        customerId
      };

      // Crea lead (usa tu service existing)
      const createdLead = await leadService.createLead(leadPayload);

      results.success.push({
        row: rowNumber,
        case: r.caso,
        leadId: createdLead.id,
        contactId: createdContact?.id ?? null
      });

    } catch (err) {
      results.errors.push({
        row: rowNumber,
        error: err.message,
        raw
      });
    }
  }

  return results;
};
