import * as ActivityService from "../services/activityService.js";
import { query } from "../db.js";

/* === GET ALL ==== */
export const getAllActivity = async (req, res) => {
  try {
    const activities = await ActivityService.getAllActivity();
    res.status(200).json(activities);
  } catch (err) {
    console.error("Error al obtener actividades:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* === GET BY ID === */
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const activity = await ActivityService.getActivityById(id);
    if (!activity) return res.status(404).json({ message: "Actividad no encontrada." });

    res.status(200).json(activity);
  } catch (err) {
    console.error("Error al obtener actividad:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* === CREATE BY ID === */
export const createActivity = async (req, res) => {
  try {
    const { leadId, userId, activityTypeId } = req.body;

    if (!leadId || !userId || activityTypeId === undefined) {
      return res.status(400).json({ message: "leadId, userId y activityTypeId son obligatorios." });
    }

    if (isNaN(activityTypeId)) {
      return res.status(400).json({ message: "activityTypeId inválido." });
    }

    const typeExists = await query(
      `SELECT 1 FROM \`activity_type\` WHERE id = ?`,
      [activityTypeId]
    );

    if (!typeExists.length) {
      return res.status(400).json({ message: "El activityTypeId no existe." });
    }

    const newActivity = await ActivityService.createActivity({
      leadId,
      userId,
      activityTypeId,
    });

    res.status(201).json(newActivity);
  } catch (err) {
    console.error("Error al crear Actividad:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* === CREATE BY CODE === */
export const createActivityByCode = async (req, res) => {
  try {
    const { code, leadId, userId } = req.body;

    if (!code || !leadId || !userId) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const activity = await ActivityService.createActivityByCode({ leadId, userId, code });

    if (!activity) {
      return res.status(409).json({ message: "Actividad ya existe o code inválido" });
    }

    res.status(201).json(activity);
  } catch (err) {
    console.error("Error creando actividad:", err);
    res.status(500).json({ message: "Error creando actividad" });
  }
};

export const create = async (req, res) => {
  return createActivity(req, res);
};

/* === DELETE === */
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const deleted = await ActivityService.deleteActivity(id);
    if (!deleted) return res.status(404).json({ message: "Actividad no encontrada." });

    res.status(200).json({ message: "Actividad eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar actividad:", err);
    res.status(500).json({ message: "Error del servidor al eliminar actividad." });
  }
};
