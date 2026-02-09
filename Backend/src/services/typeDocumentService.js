import { query } from "../db.js";

/* GET ALL */
export const getAllTypeDocuments = async () => {
  const rows = await query('SELECT * FROM typedocument');
  return rows;
};

/* GET BY ID */
export const getTypeDocumentById = async (typeDocumentId) => {
  const rows = await query(
    `SELECT * FROM typedocument WHERE id = ?`,
    [typeDocumentId]
  );
  return rows[0];
};

/* CREATE */
export const createTypeDocument = async (typeDocumentData) => {
  const { name, status } = typeDocumentData;

  const result = await query(
    `INSERT INTO typedocument (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM typedocument WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* UPDATE */
export const updateTypeDocument = async (typeDocumentId, typeDocumentData) => {
  const { name, status } = typeDocumentData;

  await query(
    `UPDATE typedocument SET name = ?, status = ? WHERE id = ?`,
    [name, status, typeDocumentId]
  );

  const rows = await query(
    `SELECT * FROM typedocument WHERE id = ?`,
    [typeDocumentId]
  );

  return rows[0];
};

/* DELETE */
export const deleteTypeDocument = async (typeDocumentId) => {
  const result = await query(
    `DELETE FROM typedocument WHERE id = ?`,
    [typeDocumentId]
  );

  return result.affectedRows > 0;
};

/* SEARCH */
export const searchTypeDocuments = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM typedocument WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
