import * as StateService from "../services/stateService.js";

export const getAllState = async (req, res) => {
  try {
    const State = await StateService.getAllState();
    res.status(200).json(State);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getStateById = async (req, res) => {
  try {
    const StateId = req.params.id;

    const State = await StateService.getStateById(StateId);

    if (!State) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(State);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const createState = async (req, res) => {
  try {
    const StateData = req.body;
    const newState = await StateService.createState(StateData);
    res.status(200).json(newState);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateState = async (req, res) => {
  try {
    const StateId = req.params.id;
    const StateData = req.body;
    const updatedState = await StateService.updateState(
      StateId,
      StateData
    );
    if (!updatedState) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedState);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteState = async (req, res) => {
  try {
    const StateId = req.params.id;
    const deleted = await StateService.deleteState(StateId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchState = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const State = await StateService.searchState(searchTerm);
    res.status(200).json(State);
  } catch (error) {
    console.error("Error al buscar un Estado:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
