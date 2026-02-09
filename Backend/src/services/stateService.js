import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllState = async () => {
  const rows = await query('SELECT * FROM state');
  return rows;
};

/* ====== GET BY ID ====== */
export const getStateById = async (StateId) => {
  const rows = await query(
    `SELECT * FROM state WHERE id = ?`,
    [StateId]
  );
  return rows[0];
};

/* ====== CREATE ====== */
export const createState = async (StateData) => {
  const { name, status } = StateData;

  const result = await query(
    `INSERT INTO state (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM state WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateState = async (StateId, StateData) => {
  const { name, status } = StateData;

  await query(
    `UPDATE state SET name = ?, status = ? WHERE id = ?`,
    [name, status, StateId]
  );

  const rows = await query(
    `SELECT * FROM state WHERE id = ?`,
    [StateId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteState = async (StateId) => {
  const result = await query(
    `DELETE FROM state WHERE id = ?`,
    [StateId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchState = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM state WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
