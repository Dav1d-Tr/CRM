import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllActivity = async () => {
  return await query(
    `SELECT * FROM activity ORDER BY createdAt`
  );
};

/* ====== GET BY ID ====== */
export const getActivityById = async (activityId) => {
  const rows = await query(
    `SELECT * FROM \`activity\` WHERE id = ?`,
    [activityId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== CREATE BY CODE (anti-duplicado) ====== */
export const createActivityByCode = async ({ leadId, userId, code }) => {
  const typeRows = await query(
    `SELECT id FROM \`activitytype\` WHERE code = ? AND status = 1`,
    [code]
  );

  if (!typeRows.length) return null;

  const activityTypeId = typeRows[0].id;

  const exists = await query(
    `SELECT 1 FROM \`activity\` 
     WHERE \`leadId\` = ? AND \`activityTypeId\` = ?`,
    [leadId, activityTypeId]
  );

  if (exists.length) return null;

  const result = await query(
    `
    INSERT INTO \`activity\`
      (\`leadId\`, \`userId\`, \`activityTypeId\`, \`createdAt\`)
    VALUES (?, ?, ?, NOW())
    `,
    [leadId, userId, activityTypeId]
  );

  const insertId = result.insertId;

  const rows = await query(
    `SELECT * FROM \`activity\` WHERE id = ?`,
    [insertId]
  );

  return rows[0];
};

/* ====== CREATE BY ID ====== */
export const createActivity = async ({ leadId, userId, activityTypeId }) => {
  const result = await query(
    `
    INSERT INTO \`activity\`
      (leadId, userId, activityTypeId, createdAt)
    VALUES (?, ?, ?, NOW())
    `,
    [leadId, userId, activityTypeId]
  );

  const insertId = result.insertId;

  const rows = await query(
    `SELECT * FROM \`activity\` WHERE id = ?`,
    [insertId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteActivity = async (activityId) => {
  const result = await query(
    `DELETE FROM \`activity\` WHERE id = ?`,
    [activityId]
  );
  return result.affectedRows > 0;
};
