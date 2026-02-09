import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllContact = async () => {
  const rows = await query(`SELECT * FROM contact`);
  return rows;
};

/* ====== GET BY ID ====== */
export const getContactById = async (ContactId) => {
  const rows = await query(`SELECT * FROM contact WHERE id = ?`, [ContactId]);
  return rows.length ? rows[0] : null;
};

/* ====== CREATE ====== */
export const createContact = async (ContactData) => {
  const { id, name, email, numberPhone, customerId } = ContactData;

  await query(
    `INSERT INTO contact (id, name, email, numberphone, customerId)
     VALUES (?, ?, ?, ?, ?)`,
    [id ?? null,
    name ?? null,
    email ?? null,
    numberPhone ?? null,
    customerId ?? null],
  );

  const rows = await query(`SELECT * FROM contact WHERE id = ?`, [id]);

  return rows[0];
};

/* ====== UPDATE (PUT / PATCH compatible) ====== */
export const updateContact = async (ContactId, ContactData) => {
  const { name, email, numberPhone, customerId } = ContactData;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }

  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }

  if (numberPhone !== undefined) {
    fields.push("numberphone = ?");
    values.push(numberPhone);
  }

  if (customerId !== undefined) {
    fields.push("customerid = ?");
    values.push(customerId);
  }

  if (!fields.length) return null;

  values.push(ContactId);
  await query(`UPDATE contact SET ${fields.join(", ")} WHERE id = ?`, values);
  const rows = await query(`SELECT * FROM contact WHERE id = ?`, [ContactId]);

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteContact = async (ContactId) => {
  const result = await query(`DELETE FROM contact WHERE id = ?`, [ContactId]);

  return result.affectedRows > 0;
};

/* ====== SEARCH (multi-field) ====== */
export const searchContact = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM contact
     WHERE name LIKE ?
        OR numberphone LIKE ?
        OR email LIKE ?`,
    [`${searchTerm}%`, `${searchTerm}%`, `${searchTerm}%`],
  );
  return rows;
};

/* ====== GET FIRST CONTACT BY CUSTOMER ====== */
export const getContactByCustomerId = async (customerId) => {
  const rows = await query(
    `SELECT *
     FROM contact
     WHERE customerid = ?
     ORDER BY id ASC
     LIMIT 1`,
    [customerId],
  );

  return rows.length ? rows[0] : null;
};

/* ====== GET ALL CONTACTS BY CUSTOMER ====== */
export const getContactsByCustomerId = async (customerId) => {
  const rows = await query(
    `SELECT *
    FROM contact
    WHERE customerId = ?
    ORDER BY id ASC
    `,
    [customerId],
  );

  return rows;
};
