import { query } from "../db.js";

/* GET ALL */
export const getAlluserRoles = async () => {
  const rows = await query('SELECT * FROM userrole');
  return rows;
};

/* GET BY ID */
export const getuserRoleById = async (userRoleId) => {
  const rows = await query(
    `SELECT * FROM userrole WHERE id = ?`,
    [userRoleId]
  );
  return rows[0];
};

/* CREATE */
export const createuserRole = async (userRoleData) => {
  const { name, status } = userRoleData;

  const result = await query(
    `INSERT INTO userrole (name, status) VALUES (?, ?)`,
    [name, status]
  );

  const insertedId = result.insertId;

  const rows = await query(
    `SELECT * FROM userrole WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
};

/* UPDATE */
export const updateuserRole = async (userRoleId, userRoleData) => {
  const { name, status } = userRoleData;

  await query(
    `UPDATE userrole SET name = ?, status = ? WHERE id = ?`,
    [name, status, userRoleId]
  );

  const rows = await query(
    `SELECT * FROM userrole WHERE id = ?`,
    [userRoleId]
  );

  return rows[0];
};

/* DELETE */
export const deleteuserRole = async (userRoleId) => {
  const result = await query(
    `DELETE FROM userrole WHERE id = ?`,
    [userRoleId]
  );

  return result.affectedRows > 0;
};

/* SEARCH */
export const searchuserRoles = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM userrole WHERE name LIKE ?`,
    [`${searchTerm}%`]
  );
  return rows;
};
