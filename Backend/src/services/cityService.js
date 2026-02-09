import { query } from "../db.js";

/* ===== GET ALL ===== */
export const getAllCitys = async () => {
  return await query(`
    SELECT 
      c.id,
      c.name,
      c.status,
      c.countryId,
      co.name AS countryName
    FROM \`city\` c
    JOIN \`country\` co ON co.id = c.countryId
    ORDER BY c.id
  `);
};

/* ===== GET BY ID ===== */
export const getCityById = async (cityId) => {
  const rows = await query(
    `SELECT * FROM \`city\` WHERE id = ?`,
    [cityId]
  );
  return rows.length ? rows[0] : null;
};

/* ===== CREATE ===== */
export const createCity = async (cityData) => {
  const { name, status, countryId } = cityData;
  const result = await query(
    `
    INSERT INTO \`city\`
      (\`name\`, \`status\`, \`countryId\`)
    VALUES (?, ?, ?)
    `,
    [name, status, countryId]
  );
  const insertId = result.insertId;
  const rows = await query(
    `SELECT * FROM \`city\` WHERE id = ?`,
    [insertId]
  );
  return rows[0];
};

/* ===== UPDATE ===== */
export const updateCity = async (cityId, cityData) => {
  const { name, status, countryId } = cityData;
  await query(
    `
    UPDATE \`city\`
    SET 
      \`name\` = ?,
      \`status\` = ?,
      \`countryId\` = ?
    WHERE id = ?
    `,
    [name, status, countryId, cityId]
  );
  const rows = await query(
    `SELECT * FROM \`city\` WHERE id = ?`,
    [cityId]
  );
  return rows.length ? rows[0] : null;
};

/* ===== DELETE ===== */
export const deleteCity = async (cityId) => {
  const result = await query(
    `DELETE FROM \`city\` WHERE id = ?`,
    [cityId]
  );
  return result.affectedRows > 0;
};

/* ===== SEARCH ===== */
export const searchCity = async (searchTerm) => {
  return await query(`
    SELECT 
      c.id,
      c.name,
      c.status,
      c.countryId,
      co.name AS countryName
    FROM \`city\` c
    JOIN \`country\` co ON co.id = c.countryId
    WHERE c.name LIKE ?
    ORDER BY c.name
  `, [`%${searchTerm}%`]);
};

/* ===== BY COUNTRY ===== */
export const getCitiesByCountry = async (countryId) => {
  return await query(
    `
    SELECT id, name
    FROM \`city\`
    WHERE \`countryId\` = ?
      AND \`status\` = true
    ORDER BY name
    `,
    [countryId]
  );
};
