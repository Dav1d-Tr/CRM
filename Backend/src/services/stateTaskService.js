import { query } from "../db.js";

/* GET ALL */
export const getAllStateTask = async () => {
  const rows = await query('SELECT * FROM  statetask');
  return rows;
};

/* GET BY ID */
export const getStateTaskById = async (StateTaskId) => {
  const rows = await query(
    `SELECT * FROM  statetask WHERE id = ?`,
    [StateTaskId]
  );
  return rows[0];
};

/* CREATE */
export const createStateTask = async (StateTaskData) => {
  const { name, status } = StateTaskData;

  const result = await query(
    `INSERT INTO  statetask (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM  statetask WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* UPDATE */
export const updateStateTask = async (StateTaskId, StateTaskData) => {
  const { name, status } = StateTaskData;

  await query(
    `UPDATE  statetask SET name = ?, status = ? WHERE id = ?`,
    [name, status, StateTaskId]
  );

  const rows = await query(
    `SELECT * FROM  statetask WHERE id = ?`,
    [StateTaskId]
  );

  return rows[0];
};

/* DELETE */
export const deleteStateTask = async (StateTaskId) => {
  const result = await query(
    `DELETE FROM  statetask WHERE id = ?`,
    [StateTaskId]
  );

  return result.affectedRows > 0;
};

/* SEARCH */
export const searchStateTask = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM  statetask WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
