import * as priorityService from "../services/priorityService.js";

export const getAllPriority = async (req, res) => {
  try {
    const priority = await priorityService.getAllPriority();
    res.status(200).json(priority);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getPriorityById = async (req, res) => {
  try {
    const priorityId = req.params.id;

    const priority = await priorityService.getPriorityById(priorityId);

    if (!priority) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(priority);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};


export const createpriority = async (req, res) => {
  try {
    const priorityData = req.body;
    const newpriority = await priorityService.createpriority(priorityData);
    res.status(200).json(newpriority);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updatepriority = async (req, res) => {
  try {
    const priorityId = req.params.id;
    const priorityData = req.body;
    const updatedpriority = await priorityService.updatepriority(
      priorityId,
      priorityData
    );
    if (!updatedpriority) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedpriority);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deletepriority = async (req, res) => {
  try {
    const priorityId = req.params.id;
    const deleted = await priorityService.deletepriority(priorityId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchpriority = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const priority = await priorityService.searchpriority(searchTerm);
    res.status(200).json(priority);
  } catch (error) {
    console.error("Error al buscar una Prioridad:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
