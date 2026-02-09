import * as TaskService from "../services/taskService.js";
import { query } from "../db.js"; // Para validaciones de FK

export const getAllTask = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTask();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error al obtener tareas:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const task = await TaskService.getTaskById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada." });

    res.status(200).json(task);
  } catch (err) {
    console.error("Error al obtener tarea:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { name, starting, endDate, stateTaskId, leadId } = req.body;

    if (!name || !starting || !endDate || !stateTaskId || !leadId)
      return res.status(400).json({ message: "Faltan campos obligatorios." });

    const cleanName = name.trim();
    const start = new Date(starting);
    const end = new Date(endDate);

    if (cleanName.length < 3)
      return res.status(400).json({ message: "El nombre debe tener mínimo 3 caracteres." });
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      return res.status(400).json({ message: "Formato de fecha inválido." });
    if (end <= start)
      return res.status(400).json({ message: "La fecha final debe ser mayor a la fecha inicial." });
    if (isNaN(stateTaskId)) return res.status(400).json({ message: "stateTaskId debe ser numérico." });

    // Validaciones FK
    const leadExists = await query('SELECT 1 FROM `leads` WHERE id = ?', [leadId]);
    if (leadExists.length === 0) return res.status(400).json({ message: "El leadId no existe." });

    const stateExists = await query('SELECT 1 FROM `statetask` WHERE id = ?', [stateTaskId]);
    if (stateExists.length === 0) return res.status(400).json({ message: "El stateTaskId no existe." });

    const newTask = await TaskService.createTask({
      name: cleanName,
      starting: start,
      endDate: end,
      stateTaskId,
      leadId,
      notifyBefore: null,
      completedAt: null,
      lastNotifiedAt: null,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ message: err.message || "Error del servidor al crear tarea." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const existing = await TaskService.getTaskById(id);
    if (!existing) return res.status(404).json({ message: "Tarea no encontrada." });

    const { name, starting, endDate, stateTaskId, leadId } = req.body;

    if (name && name.trim().length < 3)
      return res.status(400).json({ message: "El nombre debe tener mínimo 3 caracteres." });

    const newStarting = starting ? new Date(starting) : new Date(existing.starting);
    const newEndDate = endDate ? new Date(endDate) : new Date(existing.endDate);

    if (isNaN(newStarting.getTime()) || isNaN(newEndDate.getTime()))
      return res.status(400).json({ message: "Formato de fecha inválido." });
    if (newEndDate <= newStarting)
      return res.status(400).json({ message: "La fecha final debe ser mayor a la inicial." });
    if (stateTaskId && isNaN(stateTaskId))
      return res.status(400).json({ message: "stateTaskId debe ser numérico." });

    if (leadId) {
      const leadExists = await query('SELECT 1 FROM `leads` WHERE id = ?', [leadId]);
      if (leadExists.length === 0) return res.status(400).json({ message: "El leadId no existe." });
    }

    const updatedTask = await TaskService.updateTask(id, req.body);
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error al actualizar tarea:", err);
    res.status(500).json({ message: "Error del servidor al actualizar tarea." });
  }
};

export const toggleTaskState = async (req, res) => {
  try {
    const { id } = req.params;
    const { stateTaskId } = req.body;

    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });
    if (!stateTaskId || isNaN(stateTaskId)) return res.status(400).json({ message: "stateTaskId inválido." });

    const completedAt = Number(stateTaskId) === 2 ? new Date() : null;

    // Actualizar y luego traer registro
    await query('UPDATE `task` SET `stateTaskId` = ?, `completedAt` = ? WHERE id = ?', [
      stateTaskId,
      completedAt,
      id,
    ]);

    const task = await TaskService.getTaskById(id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada." });

    res.json(task);
  } catch (err) {
    console.error("Error toggleTaskState:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const deleted = await TaskService.deleteTask(id);
    if (!deleted) return res.status(404).json({ message: "Tarea no encontrada." });

    res.status(200).json({ message: "Tarea eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ message: "Error del servidor al eliminar tarea." });
  }
};

export const searchTask = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm.trim() === "")
      return res.status(400).json({ message: "Se requiere un término de búsqueda." });

    const tasks = await TaskService.searchTask(searchTerm.trim());
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error al buscar tareas:", err);
    res.status(500).json({ message: "Error del servidor al buscar tareas." });
  }
};

export const getTasksByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;
    const tasks = await TaskService.getTasksByLeadId(leadId);
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error al obtener tareas por lead:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};