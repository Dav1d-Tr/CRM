import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllUser = async () => {
  const rows = await query(`
    SELECT 
      u.id,
      u.name,
      u.lastName,
      u.email,
      u.password,
      u.numberPhone,
      u.documentId,
      u.roleId,
      ur.name AS roleName,
      td.name AS documentName
    FROM user u
    JOIN userrole ur ON ur.id = u.roleid
    JOIN typedocument td ON td.id = u.documentid
    ORDER BY u.name
  `);
  return rows;
};

/* ====== GET BY ID ====== */
export const getUserById = async (UserId) => {
  const rows = await query(
    `SELECT * FROM user WHERE id = ?`,
    [UserId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== CREATE ====== */
export const createUser = async (UserData) => {
  const {
    id,
    name,
    lastName,
    email,
    password,
    numberPhone,
    avatar,
    roleId,
    documentId
  } = UserData;

  await query(
    `INSERT INTO user 
    (id, name, lastName, email, password, numberPhone, avatar, roleId, documentId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, lastName, email, password, numberPhone, avatar, roleId, documentId]
  );

  const rows = await query(
    `SELECT * FROM user WHERE id = ?`,
    [id]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateUser = async (UserId, UserData) => {
  const {
    name,
    lastName,
    email,
    numberPhone,
    roleId,
    documentId,
    password
  } = UserData;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }

  if (lastName !== undefined) {
    fields.push("lastName = ?");
    values.push(lastName);
  }

  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }

  if (numberPhone !== undefined) {
    fields.push("numberPhone = ?");
    values.push(numberPhone);
  }

  if (roleId !== undefined) {
    fields.push("roleId = ?");
    values.push(roleId);
  }

  if (documentId !== undefined) {
    fields.push("documentId = ?");
    values.push(documentId);
  }

  if (password !== undefined) {
    fields.push("password = ?");
    values.push(password);
  }

  if (!fields.length) return null;

  values.push(UserId);

  await query(
    `UPDATE user SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const rows = await query(
    `SELECT * FROM user WHERE id = ?`,
    [UserId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteUser = async (UserId) => {
  const result = await query(
    `DELETE FROM user WHERE id = ?`,
    [UserId]
  );
  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchUser = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM user
     WHERE name LIKE ?
        OR lastName LIKE ?
        OR email LIKE ?
        OR numberPhone LIKE ?`,
    [`${searchTerm}%`, `${searchTerm}%`, `${searchTerm}%`, `${searchTerm}%`]
  );
  return rows;
};

/* ====== GET BY EMAIL ====== */
export const getUserByEmail = async (email) => {
  const rows = await query(
    `SELECT * FROM user WHERE email = ?`,
    [email]
  );
  return rows.length ? rows[0] : null;
};

/* ====== UPDATE PASSWORD ====== */
export const updatePasswordByEmail = async (email, hashedPassword) => {
  const result = await query(
    `UPDATE user SET password = ? WHERE email = ?`,
    [hashedPassword, email]
  );

  return result.affectedRows > 0;
};

/* ====== LOGIN DATA ====== */
export const getUserByEmailWithRole = async (email) => {
  const rows = await query(`
    SELECT 
      u.id,
      u.name,
      u.lastName,
      u.email,
      u.numberPhone,
      u.password,
      u.roleId,
      u.documentId,
      ur.name AS roleName,
      td.name AS documentName
    FROM user u
    JOIN userrole ur ON ur.id = u.roleid
    JOIN typedocument td ON td.id = u.documentid
    WHERE u.email = ?
  `, [email]);

  return rows.length ? rows[0] : null;
};
