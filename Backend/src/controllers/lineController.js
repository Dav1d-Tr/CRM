import * as lineService from "../services/lineService.js";

export const getAllLine = async (req, res) => {
  try {
    const line = await lineService.getAllLine();
    res.status(200).json(line);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getLineById = async (req, res) => {
  try {
    const lineId = req.params.id;

    const line = await lineService.getLineById(lineId);

    if (!line) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(line);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const createline = async (req, res) => {
  try {
    const lineData = req.body;
    const newline = await lineService.createline(lineData);
    res.status(200).json(newline);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateline = async (req, res) => {
  try {
    const lineId = req.params.id;
    const lineData = req.body;
    const updatedline = await lineService.updateline(
      lineId,
      lineData
    );
    if (!updatedline) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedline);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteline = async (req, res) => {
  try {
    const lineId = req.params.id;
    const deleted = await lineService.deleteline(lineId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchline = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const line = await lineService.searchline(searchTerm);
    res.status(200).json(line);
  } catch (error) {
    console.error("Error al buscar un Linea:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
