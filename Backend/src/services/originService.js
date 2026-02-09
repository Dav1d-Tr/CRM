import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllOrigin = async () => {
  const rows = await query('SELECT * FROM origin');
  return rows;
};

/* ====== GET BY ID ====== */
export const getOriginById = async (originId) => {
  const rows = await query(
    `SELECT * FROM origin WHERE id = ?`,
    [originId]
  );
  return rows[0];
};

/* ====== CREATE ====== */
export const createorigin = async (originData) => {
  const { name, status } = originData;

  const result = await query(
    `INSERT INTO origin (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM origin WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateorigin = async (originId, originData) => {
  const { name, status } = originData;

  await query(
    `UPDATE origin SET name = ?, status = ? WHERE id = ?`,
    [name, status, originId]
  );

  const rows = await query(
    `SELECT * FROM origin WHERE id = ?`,
    [originId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteorigin = async (originId) => {
  const result = await query(
    `DELETE FROM origin WHERE id = ?`,
    [originId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchorigin = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM origin WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
