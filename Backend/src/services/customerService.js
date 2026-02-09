// te paso los archivos de customer
import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllCustomer = async () => {
  const rows = await query('SELECT * FROM customer');
  return rows;
};

/* ====== GET BY ID ====== */
export const getCustomerById = async (CustomerId) => {
  const rows = await query(
    `SELECT * FROM customer WHERE id = ?`,
    [CustomerId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== CREATE ====== */
export const createCustomer = async (CustomerData) => {
  const { id, name, countryId, cityId } = CustomerData;

  await query(
    `INSERT INTO customer (id, name, countryId, cityId)
     VALUES (?, ?, ?, ?)`,
    [id, name, countryId, cityId]
  );

  const rows = await query(
    `SELECT * FROM customer WHERE id = ?`,
    [id]
  );

  return rows[0];
};

/* ====== UPDATE (PUT / PATCH compatible) ====== */
export const updateCustomer = async (CustomerId, CustomerData) => {
  const { name, countryId, cityId } = CustomerData;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }

  if (countryId !== undefined) {
    fields.push("countryId = ?");
    values.push(countryId);
  }

  if (cityId !== undefined) {
    fields.push("cityId = ?");
    values.push(cityId);
  }

  if (!fields.length) return null;

  values.push(CustomerId);

  await query(
    `UPDATE customer SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const rows = await query(
    `SELECT * FROM customer WHERE id = ?`,
    [CustomerId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteCustomer = async (CustomerId) => {
  const result = await query(
    `DELETE FROM customer WHERE id = ?`,
    [CustomerId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchCustomer = async (searchTerm) => {
  const rows = await query(
    `SELECT * FROM customer WHERE name LIKE ?`,
    [`%${searchTerm}%`]
  );
  return rows;
};
