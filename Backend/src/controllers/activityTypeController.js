import * as ActivityTypeService from "../services/activityTypeService.js";

export const getAllActivityType = async (req, res) => {
  try {
    const ActivityType = await ActivityTypeService.getAllActivityType();
    res.status(200).json(ActivityType);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getactivityTypeById = async (req, res) => {
  try {
    const ActivityTypeId = req.params.id;

    const ActivityType = await ActivityTypeService.getactivityTypeById(ActivityTypeId);

    if (!ActivityType) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(ActivityType);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};


export const createActivityType = async (req, res) => {
  try {
    const ActivityTypeData = req.body;
    const newActivityType = await ActivityTypeService.createActivityType(ActivityTypeData);
    res.status(200).json(newActivityType);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateactivityType = async (req, res) => {
  try {
    const ActivityTypeId = req.params.id;
    const ActivityTypeData = req.body;
    const updatedActivityType = await ActivityTypeService.updateactivityType(
      ActivityTypeId,
      ActivityTypeData
    );
    if (!updatedActivityType) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedActivityType);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteActivityType = async (req, res) => {
  try {
    const ActivityTypeId = req.params.id;
    const deleted = await ActivityTypeService.deleteActivityType(ActivityTypeId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchactivityType = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameters
    const ActivityType = await ActivityTypeService.searchactivityType(searchTerm);
    res.status(200).json(ActivityType);
  } catch (error) {
    console.error("Error al buscar un Rol:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
