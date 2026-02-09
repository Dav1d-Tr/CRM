import { query } from "../db.js";

/**
 * Busca un id por nombre exacto (case-insensitive). Lanza error si no lo encuentra.
 * table: nombre de tabla (ej: 'Country', 'City', 'Priority', ...)
 * name: texto a buscar
 */
export async function getIdByName(table, name) {
  if (!name) throw new Error(`${table}: nombre vacío`);
  const sql = `SELECT id FROM \`${table}\` WHERE LOWER(name) = LOWER(?) AND status = TRUE LIMIT 1`;
  const rows = await query(sql, [name.trim()]);
  if (!rows.length) throw new Error(`${table} no encontrado: "${name}"`);
  return rows[0].id;
}

/**
 * Buscar City por nombre y countryId (más seguro).
 */
export async function getCityIdByNameAndCountry(name, countryId) {
  if (!name) throw new Error(`City: nombre vacío`);
  const sql = `SELECT id FROM City WHERE LOWER(name) = LOWER(?) AND countryId = ? LIMIT 1`;
  const rows = await query(sql, [name.trim(), countryId]);
  if (!rows.length) throw new Error(`City no encontrada: "${name}" para countryId ${countryId}`);
  return rows[0].id;
}

/**
 * Buscar Category por nombre y lineId (Producto -> Category).
 */
export async function getCategoryIdByNameAndLine(name, lineId) {
  if (!name) throw new Error(`Category: nombre vacío`);
  const sql = `SELECT id FROM Category WHERE LOWER(name) = LOWER(?) AND lineId = ? LIMIT 1`;
  const rows = await query(sql, [name.trim(), lineId]);
  if (!rows.length) throw new Error(`Category no encontrada: "${name}" para lineId ${lineId}`);
  return rows[0].id;
}
