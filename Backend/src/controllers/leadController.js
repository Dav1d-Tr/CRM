import * as leadService from "../services/leadService.js";
import { query } from "../db.js";


/* ====== GET ====== */
export const getAllLead = async (req, res) => {
  try {
    const leads = await leadService.getAllLead();
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID requerido" });

    const lead = await leadService.getLeadById(id);
    if (!lead) return res.status(404).json({ message: "Lead no encontrado" });

    res.status(200).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== CREATE ====== */
export const createLead = async (req, res) => {
  try {
    const { userId, stateId, customerId, lineId, categoryId } = req.body;

    if (!userId || !stateId || !customerId || !lineId || !categoryId) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const newLead = await leadService.createLead(req.body);
    res.status(201).json(newLead);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ====== PUT ====== */
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedLead = await leadService.updateLead(id, req.body);
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    res.status(200).json(updatedLead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== PATCH (NORMALIZADO) ====== */
export const patchLead = async (req, res) => {
  try {
    const { id } = req.params;

    const cleanBody = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k, v === "" ? null : v])
    );

    const updatedLead = await leadService.patchLead(id, cleanBody);
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    res.status(200).json(updatedLead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== DELETE ====== */
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await leadService.deleteLead(id);

    if (deleted) {
      return res.status(404).json({ message: "Lead no encontrado" });
    }

    res.status(200).json({ message: "Lead eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== OTHERS ====== */
export const searchLead = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query requerida" });

    const leads = await leadService.searchLead(q);
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const updateLeadState = async (req, res) => {
  const { id } = req.params;
  const { stateId } = req.body;

  if (!stateId) {
    return res.status(400).json({ message: "stateId requerido" });
  }

  const lead = await leadService.updateLeadState(id, stateId);
  res.status(200).json(lead);
};

export const getLeadStatsController = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await leadService.getLeadStats(id);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Lead stats error:", error);
    res.status(500).json({ message: "Error obteniendo estadísticas" });
  }
};

export const getLeadCreatedDate = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await leadService.getLeadCreatedDate(id);
    res.json(date);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo fecha" });
  }
};

export const getLeadActivityDateByType = async (leadId, activityTypeId) => {
  const rows = await query(
    `
    SELECT createdAt
    FROM activity
    WHERE leadId = ?
      AND activityTypeId = ?
    ORDER BY createdAt ASC
    LIMIT 1
    `,
    [leadId, activityTypeId]
  );

  return rows.length ? rows[0].createdAt : null;
};

export const getLeadActivity9DateController = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await leadService.getLeadActivityDateByType(id, 9);
    res.json({ date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo fecha de cotización" });
  }
};

export const getLeadActivity11DateController = async (req, res) => {
  try {
    const { id } = req.params;
    const date = await leadService.getLeadActivityDateByType(id, 11);
    res.json({ date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo fecha de facturación" });
  }
};

export const getMonthlyLeads = async () => {
  const rows = await query(`
    SELECT 
      TO_CHAR(a."createdAt", 'YYYY-MM') AS month,
      COUNT(DISTINCT a."leadId") AS total
    FROM "Activity" a
    WHERE a."activityTypeId" = 1 -- CREATE
    GROUP BY month
    ORDER BY month ASC
  `);

  return rows.map(r => ({ month: r.month, total: Number(r.total) }));
};

export const getMonthlyLeadsController = async (req, res) => {
  try {
    const monthlyLeads = await leadService.getMonthlyLeads();
    res.status(200).json(monthlyLeads);
  } catch (err) {
    console.error("Error obteniendo leads mensuales:", err);
    res.status(500).json({ message: "Error obteniendo leads mensuales" });
  }
};

export const getLeadTimeMetricsController = async (req, res) => {
  try {
    const metrics = await leadService.getLeadTimeMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error obteniendo métricas de tiempo:", error);
    res.status(500).json({ message: "Error obteniendo métricas de tiempo" });
  }
};

export const getRevenueStatsController = async (req, res) => {
  try {
    const { mode } = req.query;
    const stats = await leadService.getRevenueStats({ mode });
    res.status(200).json(stats);
  } catch (err) {
    console.error("Revenue stats error:", err);
    res.status(500).json({ message: "Error obteniendo estadísticas" });
  }
};

/* ====== IMPORT ====== */
export const importLeads = async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "Archivo vacío" });
  }

  const success = [];
  const errors = [];

  // Validador de fechas
  const isValidDate = (d) =>
    d instanceof Date && !isNaN(d);

  try {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      try {
        await query("START TRANSACTION");
        if (
          !r.caso ||
          !r.codigo_cliente ||
          !r.codigo_contacto ||
          !r.cliente ||
          !r.pais ||
          !r.ciudad ||
          !r.contacto ||
          !r.correo ||
          !r.telefono ||
          !r.encargado
        ) {
          throw new Error("Faltan datos obligatorios");
        }

        /* ================= VALIDAR FECHAS ================= */

        if (!r.fecha_creacion) {
          throw new Error("Falta fecha de creación");
        }

        if (r.cotizacion && !r.fecha_cotizacion) {
          throw new Error("Falta fecha de cotización");
        }

        if (r.facturacion && !r.fecha_facturacion) {
          throw new Error("Falta fecha de facturación");
        }

        const fechaCreacion = new Date(r.fecha_creacion);

        if (!isValidDate(fechaCreacion)) {
          throw new Error("Fecha de creación inválida");
        }

        let fechaCotizacion = null;
        let fechaFacturacion = null;

        if (r.fecha_cotizacion) {
          fechaCotizacion = new Date(r.fecha_cotizacion);
          if (!isValidDate(fechaCotizacion)) {
            throw new Error("Fecha de cotización inválida");
          }
        }

        if (r.fecha_facturacion) {
          fechaFacturacion = new Date(r.fecha_facturacion);
          if (!isValidDate(fechaFacturacion)) {
            throw new Error("Fecha de facturación inválida");
          }
        }

        /* ================= VALIDAR LEAD DUPLICADO ================= */

        const leadExist = await query(
          `SELECT id FROM Leads WHERE id = ?`,
          [r.caso]
        );
        if (leadExist.length) {
          throw new Error("Lead ya existe");
        }

        /* ================= VALIDAR OV ================= */

        if (r.ov && !r.fecha_ov) {
          throw new Error("OV sin fecha");
        }
        if (!r.ov && r.fecha_ov) {
          throw new Error("Fecha OV sin código");
        }
        if (r.ov) {
          const existOV = await query(
            `SELECT id FROM Leads WHERE codOV = ?`,
            [r.ov]
          );
          if (existOV.length) {
            throw new Error("OV duplicada");
          }
        }

        /* ================= PAÍS ================= */

        const [pais] = await query(
          `SELECT id FROM Country WHERE name = ?`,
          [r.pais]
        );
        if (!pais) throw new Error("País no existe");

        /* ================= CIUDAD ================= */

        const [ciudad] = await query(
          `SELECT id FROM City WHERE name = ? AND countryId = ?`,
          [r.ciudad, pais.id]
        );
        if (!ciudad) throw new Error("Ciudad no existe");

        /* ================= CLIENTE ================= */

        const customerExist = await query(
          `SELECT id FROM Customer WHERE id = ?`,
          [r.codigo_cliente]
        );
        if (!customerExist.length) {
          await query(
            `INSERT INTO Customer (id, name, countryId, cityId)
             VALUES (?,?,?,?)`,
            [
              r.codigo_cliente,
              r.cliente,
              pais.id,
              ciudad.id
            ]
          );
        }

        /* ================= CONTACT ================= */

        const contactExist = await query(
          `SELECT id FROM Contact WHERE id = ?`,
          [r.codigo_contacto]
        );
        if (!contactExist.length) {
          await query(
            `INSERT INTO Contact
             (id, name, email, numberPhone, customerId)
             VALUES (?,?,?,?,?)`,
            [
              r.codigo_contacto,
              r.contacto,
              r.correo,
              r.telefono,
              r.codigo_cliente
            ]
          );
        }

        /* ================= USUARIO ================= */

        const [user] = await query(
          `SELECT id FROM User WHERE id = ?`,
          [r.encargado]
        );
        if (!user) throw new Error("Usuario no existe");

        /* ================= ESTADO ================= */

        const [estado] = await query(
          `SELECT id FROM State WHERE name = ?`,
          [r.estado]
        );
        if (!estado) throw new Error("Estado no existe");

        /* ================= PRIORIDAD ================= */

        const [prioridad] = await query(
          `SELECT id FROM Priority WHERE name = ?`,
          [r.prioridad]
        );
        if (!prioridad) throw new Error("Prioridad no existe");

        /* ================= ORIGEN ================= */

        const [origen] = await query(
          `SELECT id FROM Origin WHERE name = ?`,
          [r.origen]
        );
        if (!origen) throw new Error("Origen no existe");

        /* ================= LÍNEA ================= */

        const [linea] = await query(
          `SELECT id FROM Line WHERE name = ?`,
          [r.linea]
        );
        if (!linea) throw new Error("Línea no existe");

        /* ================= PRODUCTO ================= */

        const [producto] = await query(
          `SELECT id FROM Category WHERE name = ?`,
          [r.producto]
        );
        if (!producto) throw new Error("Categoría no existe");

        /* ================= INSERT LEAD ================= */

        await query(
          `INSERT INTO Leads (
            id,
            observations,
            cancellationReason,
            cotization,
            quotedValue,
            codOV,
            dateOV,
            billing,
            billingValue,
            userId,
            stateId,
            priorityId,
            originId,
            lineId,
            categoryId,
            customerId
          )
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            r.caso,
            r.observaciones || "",
            r.cancelacion || "",
            r.cotizacion || null,
            Number(r.cotizado) || null,
            r.ov || null,
            r.fecha_ov ? new Date(r.fecha_ov) : null,
            r.facturacion || null,
            Number(r.facturado) || null,
            user.id,
            estado.id,
            prioridad.id,
            origen.id,
            linea.id,
            producto.id,
            r.codigo_cliente
          ]
        );

        /* ================= ACTIVIDADES ================= */

        // Creación 
        await query(
          `INSERT INTO Activity
          (leadId, userId, activityTypeId, createdAt)
          VALUES (?,?,?,?)`,
          [r.caso, user.id, 1, fechaCreacion]
        );

        // Cotización
        if (fechaCotizacion) {
          await query(
            `INSERT INTO Activity
            (leadId, userId, activityTypeId, createdAt)
            VALUES (?,?,?,?)`,
            [r.caso, user.id, 9, fechaCotizacion]
          );
        }

        // Facturación
        if (fechaFacturacion) {
          await query(
            `INSERT INTO Activity
            (leadId, userId, activityTypeId, createdAt)
            VALUES (?,?,?,?)`,
            [r.caso, user.id, 11, fechaFacturacion]
          );
        }

        /* ================= CONFIRMAR ================= */

        await query("COMMIT");

        success.push({
          row: i + 2,
          leadId: r.caso
        });
      } catch (rowError) {
        await query("ROLLBACK");
        errors.push({
          row: i + 2,
          error: rowError.message
        });
      }
    }
    return res.json({
      total: rows.length,
      imported: success.length,
      success,
      errors
    });

  } catch (err) {

    console.error("IMPORT ERROR:", err);
    return res.status(500).json({
      message: "Error importando Excel",
      error: err.message
    });
  }
};
