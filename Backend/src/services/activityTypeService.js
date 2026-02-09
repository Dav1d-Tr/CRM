import { query } from "../db.js";

/* GET ALL */
export const getAllActivityType = async () => {
  const rows = await query('SELECT * FROM  activitytype');
  return rows;
};

/* GET BY ID */
export const getactivityTypeById = async (activityTypeId) => {
  const rows = await query(
    `SELECT * FROM  activitytype WHERE id = ?`,
    [activityTypeId]
  );
  return rows[0];
};

/* CREATE */
export const createActivityType = async (activityTypeData) => {
  const { code, name, status } = activityTypeData;

  const result = await query(
    `INSERT INTO  activitytype (code, name, status) VALUES (?, ?, ?)`,
    [code, name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM  activitytype WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* UPDATE */
export const updateactivityType = async (activityTypeId, activityTypeData) => {
  const { code, name, status } = activityTypeData;

  await query(
    `UPDATE  activitytype SET code = ?, name = ?, status = ? WHERE id = ?`,
    [code, name, status, activityTypeId]
  );

  const rows = await query(
    `SELECT * FROM  activitytype WHERE id = ?`,
    [activityTypeId]
  );

  return rows[0];
};

/* DELETE */
export const deleteActivityType = async (activityTypeId) => {
  const result = await query(
    `DELETE FROM  activitytype WHERE id = ?`,
    [activityTypeId]
  );

  return result.affectedRows > 0;
};

/* SEARCH */
export const searchactivityType = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM  activitytype WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
