import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllLine = async () => {
  const rows = await query('SELECT * FROM line');
  return rows;
};

/* ====== GET BY ID ====== */
export const getLineById = async (lineId) => {
  const rows = await query(
    `SELECT * FROM line WHERE id = ?`,
    [lineId]
  );
  return rows[0];
};

/* ====== CREATE ====== */
export const createline = async (lineData) => {
  const { name, status } = lineData;

  const result = await query(
    `INSERT INTO line (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM line WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateline = async (lineId, lineData) => {
  const { name, status } = lineData;

  await query(
    `UPDATE line SET name = ?, status = ? WHERE id = ?`,
    [name, status, lineId]
  );

  const rows = await query(
    `SELECT * FROM line WHERE id = ?`,
    [lineId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteline = async (lineId) => {
  const result = await query(
    `DELETE FROM line WHERE id = ?`,
    [lineId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchline = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM line WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
