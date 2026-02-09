import { query } from "../db.js";

/* ====== GET ALL ====== */
export const getAllComment = async () => {
  return await query(`SELECT * FROM \`comment\``);
};

/* ====== GET BY ID ====== */
export const getCommentById = async (commentId) => {
  const rows = await query(
    `SELECT * FROM \`comment\` WHERE id = ?`,
    [commentId]
  );
  return rows.length ? rows[0] : null;
};

/* ====== CREATE ====== */
export const createComment = async ({ observations, userId, leadId }) => {
  const day = new Date();

  const result = await query(
    `
    INSERT INTO \`comment\`
      (\`observations\`, \`day\`, \`userId\`, \`leadId\`)
    VALUES (?, ?, ?, ?)
    `,
    [observations, day, userId, leadId]
  );

  const insertId = result.insertId;

  const rows = await query(
    `SELECT * FROM \`comment\` WHERE id = ?`,
    [insertId]
  );

  return rows[0];
};

/* ====== UPDATE ====== */
export const updateComment = async (commentId, CommentData) => {
  const { observations, userId, leadId } = CommentData;
  const day = new Date();

  await query(
    `
    UPDATE \`comment\`
    SET \`observations\` = ?,
        \`day\` = ?,
        \`userId\` = ?,
        \`leadId\` = ?
    WHERE id = ?
    `,
    [observations, day, userId, leadId, commentId]
  );

  const rows = await query(
    `SELECT * FROM \`comment\` WHERE id = ?`,
    [commentId]
  );

  return rows[0];
};

/* ====== DELETE ====== */
export const deleteComment = async (commentId) => {
  const result = await query(
    `DELETE FROM \`comment\` WHERE id = ?`,
    [commentId]
  );
  return result.affectedRows > 0;
};

/* ====== COMMENTS BY LEAD ====== */
export const getCommentsByLeadId = async (leadId) => {
  return await query(
    `
    SELECT 
      c.*,
      u.\`name\`,
      u.\`lastName\`
    FROM \`comment\` c
    JOIN \`user\` u ON u.id = c.\`userId\`
    WHERE c.\`leadId\` = ?
    ORDER BY c.\`day\` DESC
    `,
    [leadId]
  );
};
