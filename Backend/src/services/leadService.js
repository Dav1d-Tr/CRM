import { query } from "../db.js";
import { createActivityByCode } from "./activityService.js";
import * as CategoryService from "./categoryService.js";

/* ====== GET ====== */
export const getAllLead = async () => {
  const rows = await query(`
    SELECT 
      l.*,
      CAST(l.quotedValue AS DECIMAL(20,2)) AS quotedValue,
      CAST(l.billingValue AS DECIMAL(20,2)) AS billingValue,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', a.id,
            'activityTypeId', a.activityTypeId,
            'createdAt', a.createdAt
          )
        ), JSON_ARRAY()
      ) AS activities
    FROM leads l
    LEFT JOIN activity a ON a.leadId = l.id
    GROUP BY l.id
  `);

  return rows;
};

export const getLeadById = async (LeadId) => {
  const rows = await query(`
    SELECT 
      l.*,
      CAST(l.quotedValue AS DECIMAL(16,2)) AS quotedValue,
      CAST(l.billingValue AS DECIMAL(16,2)) AS billingValue,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', a.id,
            'activityTypeId', a.activityTypeId,
            'createdAt', a.createdAt
          )
        ), JSON_ARRAY()
      ) AS activities
    FROM leads l
    LEFT JOIN activity a ON a.leadId = l.id
    WHERE l.id = ?
    GROUP BY l.id
  `, [LeadId]);

  return rows.length ? rows[0] : null;
};

/* ====== CREATE (transaccional) ====== */
export const createLead = async (LeadData) => {
  const {
    id,
    observations,
    cancellationReason,
    codOV,
    dateOV,
    cotization,
    quotedValue,
    billing,
    billingValue,
    userId,
    engineeringUserId,
    stateId,
    priorityId,
    originId,
    lineId,
    categoryId,
    customerId,
  } = LeadData;

  await query(
    `INSERT INTO leads (
        id, observations, cancellationReason, codOV, dateOV, cotization, quotedValue,
        billing, billingValue, userId, engineeringUserId, stateId,
        priorityId, originId, lineId, categoryId, customerId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id ?? null,
      observations ?? null,
      cancellationReason ?? null,
      codOV ?? null,
      dateOV ?? null,
      cotization ?? null,
      quotedValue ?? null,
      billing ?? null,
      billingValue ?? null,
      userId ?? null,
      engineeringUserId ?? null,
      stateId ?? null,
      priorityId ?? null,
      originId ?? null,
      lineId ?? null,
      categoryId ?? null,
      customerId ?? null,
    ]
  );

  const rows = await query(`SELECT * FROM leads WHERE id = ?`, [id]);
  const lead = rows[0];

  if (!lead) {
    throw new Error("No se pudo crear el lead");
  }

  await query(
    `INSERT INTO \`activity\` (leadId, userId, activityTypeId, createdAt) 
     VALUES (?, ?, ?, NOW())`,
    [lead.id, lead.userId, 1]
  );

  return lead;
};

/* ====== PATCH ====== */
export const patchLead = async (LeadId, LeadData) => {
  const before = await getLeadById(LeadId);
  if (!before) return null;

  const {
    observations,
    cancellationReason,
    codOV,
    dateOV,
    cotization,
    quotedValue,
    billing,
    billingValue,
    userId,
    engineeringUserId,
    stateId,
    priorityId,
    originId,
    lineId,
    categoryId,
    customerId,
  } = LeadData;

  const newLineId = lineId ?? before.lineId;
  const newCategoryId = categoryId ?? before.categoryId;

  if (newCategoryId) {
    const category = await CategoryService.getCategoryById(newCategoryId);
    if (!category) throw new Error("La categoría no existe");
    if (Number(category.lineId) !== Number(newLineId)) {
      throw new Error("La categoría no pertenece a la línea seleccionada");
    }
  }

  const safe = val => val === undefined ? null : val;

  await query(
    `UPDATE leads
     SET observations = COALESCE(?, observations),
        cancellationReason = COALESCE(?, cancellationReason),
        codOV = COALESCE(?, codOV),
        dateOV = COALESCE(?, dateOV),
        cotization = COALESCE(?, cotization),
        quotedValue = COALESCE(?, quotedValue),
        billing = COALESCE(?, billing),
        billingValue = COALESCE(?, billingValue),
        userId = COALESCE(?, userId),
        engineeringUserId = COALESCE(?, engineeringUserId),
        stateId = COALESCE(?, stateId),
        priorityId = COALESCE(?, priorityId),
        originId = COALESCE(?, originId),
        lineId = COALESCE(?, lineId),
        categoryId = COALESCE(?, categoryId),
        customerId = COALESCE(?, customerId)
     WHERE id = ?`,
    [
      safe(observations), safe(cancellationReason), safe(codOV), safe(dateOV), safe(cotization), safe(quotedValue),
      safe(billing), safe(billingValue), safe(userId), safe(engineeringUserId), safe(stateId),
      safe(priorityId), safe(originId), safe(lineId), safe(categoryId), safe(customerId),
      LeadId
    ]
  );

  const after = await getLeadById(LeadId);

  if (!before.cotization && after.cotization) {
    await createActivityByCode({ leadId: LeadId, userId: after.userId, code: "ADMIN_PRICE" });
  }
  if (!before.codOV && after.codOV) {
    await createActivityByCode({ leadId: LeadId, userId: after.userId, code: "ADMIN_OV" });
  }
  if (!before.billing && after.billing) {
    await createActivityByCode({ leadId: LeadId, userId: after.userId, code: "ADMIN_BILLED" });
  }

  return after;
};

/* ====== CAMBIO DE ESTADO ====== */
export const updateLeadState = async (leadId, stateId) => {
  const before = await getLeadById(leadId);
  if (!before) return null;

  const rows = await query(
    `UPDATE leads SET stateId = ? WHERE id = ?`,
    [stateId, leadId]
  );

  const after = rows[0];

  const stateToCodeMap = {
    2: "PRICE",
    3: "ENGINEERING",
    4: "FOLLOW-UP",
    5: "KICK-OFF",
    6: "OV",
    7: "BILLED",
    8: "CANCELED"
  };

  const code = stateToCodeMap[stateId];

  if (code) {
    await createActivityByCode({ leadId, userId: after.userId, code });
  }

  return after;
};

/* ====== OTHERS ====== */
export const deleteLead = async (LeadId) => {
  const { rowCount } = await query(`DELETE FROM leads WHERE id = ?`, [LeadId]);
  return rowCount > 0;
};

export const searchLead = async (searchTerm) => {
  const term = `%${searchTerm.toLowerCase()}%`;
  const rows = await query(`
    SELECT *,
      CAST(quotedValue AS DECIMAL(10,2)) AS quotedValue,
      CAST(billingValue AS DECIMAL(10,2)) AS billingValue
    FROM leads
    WHERE LOWER(codOV) LIKE ? OR LOWER(cotization) LIKE ? OR LOWER(billing) LIKE ?
  `, [term, term, term]);
  return rows;
};

export const getLeadCreatedDate = async (leadId) => {
  const rows = await query(`
    SELECT createdAt
    FROM activity
    WHERE leadId = ? AND activityTypeId = 1
    ORDER BY createdAt ASC
    LIMIT 1
  `, [leadId]);

  return rows.length ? rows[0] : null;
};

export const getLeadStats = async (leadId) => {
  const rows = await query(`
    SELECT
      (SELECT COUNT(*) FROM task t WHERE t.leadId = l.id AND t.stateTaskId = 2) AS completedTasks,
      (SELECT COUNT(*) FROM task t WHERE t.leadId = l.id) AS totalTasks,
      (SELECT COUNT(*) FROM comment c WHERE c.leadId = l.id) AS comments
    FROM leads l
    WHERE l.id = ?
  `, [leadId]);

  return rows[0] || { completedTasks: 0, totalTasks: 0, comments: 0 };
};

export const getLeadActivityDateByType = async (leadId, activityTypeId) => {
  const rows = await query(`
    SELECT createdAt
    FROM activity
    WHERE leadId = ? AND activityTypeId = ?
    ORDER BY createdAt ASC
    LIMIT 1
  `, [leadId, activityTypeId]);

  return rows.length ? rows[0].createdAt : null;
};

export const getMonthlyLeads = async () => {
  const rows = await query(`
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month,
           COUNT(DISTINCT leadId) AS total
    FROM activity
    WHERE activityTypeId = 1
    GROUP BY month
    ORDER BY month ASC
  `);

  return rows.map(r => ({ month: r.month, total: Number(r.total) }));
};

export const getLeadTimeMetrics = async () => {
  const rows = await query(`
    SELECT
      l.id AS leadId,
      l.lineId,
      a.activityTypeId,
      a.createdAt
    FROM leads l
    JOIN activity a ON a.leadId = l.id
    ORDER BY l.id, a.createdAt
  `);

  const metricsMap = {};

  const validStates = new Set([1, 2, 3, 4, 5, 6, 7]);
  const ignored = new Set([9, 10]);

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const lineId = r.lineId;
    const state = Number(r.activityTypeId);

    if (!validStates.has(state)) continue;

    if (!metricsMap[lineId]) {
      metricsMap[lineId] = {
        lineId,
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
      };
    }

    let j = i + 1;
    let nextReal = null;

    while (j < rows.length && rows[j].leadId === r.leadId) {
      const s = Number(rows[j].activityTypeId);
      if (!ignored.has(s)) {
        nextReal = rows[j];
        break;
      }
      j++;
    }

    if (!nextReal) continue;

    const nextState = Number(nextReal.activityTypeId);

    const isValidTransition =
      (state >= 1 && state <= 6 && nextState === state + 1) ||
      (state === 7 && nextState === 11);

    if (!isValidTransition) continue;

    const diffSeconds =
      (new Date(nextReal.createdAt) - new Date(r.createdAt)) / 1000;

    metricsMap[lineId][state].push(diffSeconds);
  }

  const avg = arr =>
    arr.length
      ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
      : 0;

  return Object.values(metricsMap).map(line => ({
    lineId: line.lineId,
    prospeccion: avg(line[1]),
    cotizacion: avg(line[2]),
    ingenieria: avg(line[3]),
    seguimiento: avg(line[4]),
    kickoff: avg(line[5]),
    ov: avg(line[6]),
    facturacion: avg(line[7]),
  }));
};



export const getRevenueStats = async ({ mode = "monthly" }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let dateFilter = "";
  let periodLabel = "";

  if (mode === "monthly") {
    dateFilter = `
      YEAR(a.createdAt) = ${year}
      AND MONTH(a.createdAt) = ${month}
    `;
    periodLabel = `${year}-${String(month).padStart(2, "0")}`;
  } else {
    const quarter = Math.ceil(month / 3);
    const startMonth = (quarter - 1) * 3 + 1;
    const endMonth = startMonth + 2;

    dateFilter = `
      YEAR(a.createdAt) = ${year}
      AND MONTH(a.createdAt) BETWEEN ${startMonth} AND ${endMonth}
    `;
    periodLabel = `Q${quarter}-${year}`;
  }

  const rows = await query(`
    SELECT
      SUM(CASE WHEN a.activityTypeId = 9 THEN l.quotedValue ELSE 0 END) AS quoted,
      SUM(CASE WHEN a.activityTypeId = 11 THEN l.billingValue ELSE 0 END) AS billed
    FROM activity a
    JOIN leads l ON l.id = a.leadId
    WHERE ${dateFilter}
  `);

  return {
    mode,
    period: periodLabel,
    quoted: Number(rows[0].quoted || 0),
    billed: Number(rows[0].billed || 0),
  };
};
