import * as originService from "../services/originService.js";

export const getAllOrigin = async (req, res) => {
  try {
    const origin = await originService.getAllOrigin();
    res.status(200).json(origin);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getOriginById = async (req, res) => {
  try {
    const originId = req.params.id;

    const origin = await originService.getOriginById(originId);

    if (!origin) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(origin);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const createorigin = async (req, res) => {
  try {
    const originData = req.body;
    const neworigin = await originService.createorigin(originData);
    res.status(200).json(neworigin);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateorigin = async (req, res) => {
  try {
    const originId = req.params.id;
    const originData = req.body;
    const updatedorigin = await originService.updateorigin(
      originId,
      originData
    );
    if (!updatedorigin) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedorigin);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteorigin = async (req, res) => {
  try {
    const originId = req.params.id;
    const deleted = await originService.deleteorigin(originId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchorigin = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const origin = await originService.searchorigin(searchTerm);
    res.status(200).json(origin);
  } catch (error) {
    console.error("Error al buscar un Origen:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
