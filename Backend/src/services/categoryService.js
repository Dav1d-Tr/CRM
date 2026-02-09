import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllCategories = async () => {
  return await query(`
    SELECT 
      c.id,
      c.name,
      c.status,
      c.lineId,
      l.name AS lineName
    FROM \`category\` c
    JOIN \`line\` l ON l.id = c.lineId
    ORDER BY c.id
  `);
};

/* ====== GET BY ID ====== */
export const getCategoryById = async (categoryId) => {
  const rows = await query(
    `SELECT * FROM \`category\` WHERE id = ?`,
    [categoryId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== BY LINE ====== */
export const getCategoriesByLine = async (lineId) => {
  return await query(
    `
    SELECT id, name
    FROM \`category\`
    WHERE \`lineId\` = ?
      AND \`status\` = true
    ORDER BY name
    `,
    [lineId]
  );
};

/* ====== CREATE ====== */
export const createCategory = async (categoryData) => {
  const { name, status, lineId } = categoryData;

  const result = await query(
    `
    INSERT INTO \`category\`
      (\`name\`, \`status\`, \`lineId\`)
    VALUES (?, ?, ?)
    `,
    [name, status, lineId]
  );

  const insertId = result.insertId;

  const rows = await query(
    `SELECT * FROM \`category\` WHERE id = ?`,
    [insertId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateCategory = async (categoryId, categoryData) => {
  const { name, status, lineId } = categoryData;

  await query(
    `
    UPDATE \`category\`
    SET 
      \`name\` = ?,
      \`status\` = ?,
      \`lineId\` = ?
    WHERE id = ?
    `,
    [name, status, lineId, categoryId]
  );

  const rows = await query(
    `SELECT * FROM \`category\` WHERE id = ?`,
    [categoryId]
  );

  return rows.length ? rows[0] : null;
};

/* ====== DELETE ====== */
export const deleteCategory = async (categoryId) => {
  const result = await query(
    `DELETE FROM \`category\` WHERE id = ?`,
    [categoryId]
  );

  return result.affectedRows > 0;
};

/* ====== SEARCH ====== */
export const searchCategory = async (searchTerm) => {
  return await query(
    `
    SELECT *
    FROM \`category\`
    WHERE \`name\` LIKE ?
    ORDER BY \`name\`
    `,
    [`${searchTerm}%`]
  );
};
