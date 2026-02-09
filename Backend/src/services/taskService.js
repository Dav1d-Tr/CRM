import { query } from "../db.js";

/* ===================== GET ALL ===================== */
export const getAllTask = async () => {
  return await query('SELECT * FROM `task`');
};

/* ===================== GET BY ID ===================== */
export const getTaskById = async (taskId) => {
  const rows = await query('SELECT * FROM `task` WHERE id = ?', [taskId]);
  return rows.length ? rows[0] : null;
};

/* ===================== CREATE ===================== */
export const createTask = async (taskData) => {
  const { name, starting, endDate, stateTaskId, leadId } = taskData;

  const result = await query(
    `INSERT INTO \`task\` 
      (\`name\`, \`starting\`, \`endDate\`, \`stateTaskId\`, \`leadId\`)
     VALUES (?, ?, ?, ?, ?)`,
    [name, starting, endDate, stateTaskId, leadId]
  );

  const insertId = result.insertId;

  const rows = await query('SELECT * FROM `task` WHERE id = ?', [insertId]);
  return rows[0];
};

/* ===================== UPDATE ===================== */
export const updateTask = async (id, data) => {
  const { stateTaskId } = data;
  const completedAt = Number(stateTaskId) === 2 ? new Date() : null;

  await query(
    `UPDATE \`task\`
     SET \`stateTaskId\` = ?, \`completedAt\` = ?
     WHERE id = ?`,
    [stateTaskId, completedAt, id]
  );

  const rows = await query('SELECT * FROM `task` WHERE id = ?', [id]);
  return rows[0];
};

/* ===================== DELETE ===================== */
export const deleteTask = async (taskId) => {
  const result = await query('DELETE FROM `task` WHERE id = ?', [taskId]);
  return result.affectedRows > 0;
};

/* ===================== SEARCH ===================== */
export const searchTask = async (searchTerm) => {
  const rows = await query(
    'SELECT * FROM `task` WHERE LOWER(`name`) LIKE ?',
    [`${searchTerm.toLowerCase()}%`]
  );
  return rows;
};

/* ===================== TASKS BY LEAD ===================== */
export const getTasksByLeadId = async (leadId) => {
  const rows = await query(
    `SELECT t.*, s.name AS stateName
     FROM \`task\` t
     JOIN \`statetask\` s ON s.id = t.stateTaskId
     WHERE t.leadId = ?
     ORDER BY t.starting ASC`,
    [leadId]
  );
  return rows;
};

/* ===================== LEAD STATS ===================== */
export const getLeadStats = async (leadId) => {
  const rows = await query(
    `SELECT
       SUM(CASE WHEN t.stateTaskId = 2 THEN 1 ELSE 0 END) AS completedTasks,
       COUNT(t.id) AS totalTasks,
       COUNT(c.id) AS comments
     FROM \`leads\` l
     LEFT JOIN \`task\` t ON t.leadId = l.id
     LEFT JOIN \`comment\` c ON c.leadId = l.id
     WHERE l.id = ?`,
    [leadId]
  );

  return rows[0] || { completedTasks: 0, totalTasks: 0, comments: 0 };
};