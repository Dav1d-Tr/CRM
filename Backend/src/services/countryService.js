import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllCountrys = async () => {
  return await query(`SELECT * FROM \`country\``);
};

/* ====== GET BY ID ====== */
export const getCountryById = async (countryId) => {
  const rows = await query(
    `SELECT * FROM \`country\` WHERE id = ?`,
    [countryId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== CREATE ====== */
export const createCountry = async (countryData) => {
  const { name, status, lat, lng, flag, prefix } = countryData;

  const result = await query(
    `
    INSERT INTO \`country\`
      (\`name\`, \`status\`, \`lat\`, \`lng\`, \`flag\`, \`prefix\`)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, status, lat, lng, flag, prefix]
  );

  const insertId = result.insertId;

  const rows = await query(
    `SELECT * FROM \`country\` WHERE id = ?`,
    [insertId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateCountry = async (countryId, countryData) => {
  const { name, status, lat, lng, flag, prefix } = countryData;

  await query(
    `
    UPDATE \`country\`
    SET 
      \`name\` = ?,
      \`status\` = ?,
      \`lat\` = ?,
      \`lng\` = ?,
      \`flag\` = ?,
      \`prefix\` = ?
    WHERE id = ?
    `,
    [name, status, lat, lng, flag, prefix, countryId]
  );

  const rows = await query(
    `SELECT * FROM \`country\` WHERE id = ?`,
    [countryId]
  );

  return rows.length ? rows[0] : null;
};

/* ====== DELETE ====== */
export const deleteCountry = async (countryId) => {
  const result = await query(
    `DELETE FROM \`country\` WHERE id = ?`,
    [countryId]
  );
  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchCountry = async (searchTerm) => {
  return await query(
    `SELECT * FROM \`country\` WHERE \`name\` LIKE ?`,
    [`${searchTerm}%`]
  );
};

/* ====== STATS (customers by country) ====== */
export const getCustomerCountByCountry = async () => {
  return await query(`
    SELECT 
      c.id,
      c.name,
      c.lat,
      c.lng,
      c.flag,
      c.prefix,
      COUNT(cu.id) AS customers
    FROM \`country\` c
    LEFT JOIN \`customer\` cu 
      ON cu.\`countryId\` = c.id
    GROUP BY c.id, c.name, c.lat, c.lng, c.flag, c.prefix
    ORDER BY customers DESC
  `);
};
