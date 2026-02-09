import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllPriority = async () => {
  const rows = await query('SELECT * FROM priority');
  return rows;
};

/* ====== GET BY ID ====== */
export const getPriorityById = async (priorityId) => {
  const rows = await query(
    `SELECT * FROM priority WHERE id = ?`,
    [priorityId]
  );
  return rows[0];
};

/* ====== CREATE ====== */
export const createpriority = async (priorityData) => {
  const { name, status } = priorityData;

  const result = await query(
    `INSERT INTO priority (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM priority WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updatepriority = async (priorityId, priorityData) => {
  const { name, status } = priorityData;

  await query(
    `UPDATE priority SET name = ?, status = ? WHERE id = ?`,
    [name, status, priorityId]
  );

  const rows = await query(
    `SELECT * FROM priority WHERE id = ?`,
    [priorityId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deletepriority = async (priorityId) => {
  const result = await query(
    `DELETE FROM priority WHERE id = ?`,
    [priorityId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchpriority = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM priority WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
