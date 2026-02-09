import * as stateTaskService from "../services/stateTaskService.js";

export const getAllStateTask = async (req, res) => {
  try {
    const StateTask = await stateTaskService.getAllStateTask();
    res.status(200).json(StateTask);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getStateTaskById = async (req, res) => {
  try {
    const StateTaskId = req.params.id;

    const StateTask = await stateTaskService.getStateTaskById(StateTaskId);

    if (!StateTask) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(StateTask);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};


export const createStateTask = async (req, res) => {
  try {
    const StateTaskData = req.body;
    const newStateTask = await stateTaskService.createStateTask(StateTaskData);
    res.status(200).json(newStateTask);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateStateTask = async (req, res) => {
  try {
    const StateTaskId = req.params.id;
    const StateTaskData = req.body;
    const updatedStateTask = await stateTaskService.updateStateTask(
      StateTaskId,
      StateTaskData
    );
    if (!updatedStateTask) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedStateTask);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteStateTask = async (req, res) => {
  try {
    const StateTaskId = req.params.id;
    const deleted = await stateTaskService.deleteStateTask(StateTaskId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchStateTask = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameters
    const StateTask = await stateTaskService.searchStateTask(searchTerm);
    res.status(200).json(StateTask);
  } catch (error) {
    console.error("Error al buscar un Rol:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
