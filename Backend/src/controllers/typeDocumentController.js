import * as typeDocumentService from "../services/typeDocumentService.js";

export const getAllTypeDocuments = async (req, res) => {
  try {
    const TypeDocuments = await typeDocumentService.getAllTypeDocuments();
    res.status(200).json(TypeDocuments);
  } catch (err) {
    console.error("Error al obtener los roles de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const getTypeDocumentById = async (req, res) => {
  try {
    const TypeDocumentId = req.params.id;

    const TypeDocument = await typeDocumentService.getTypeDocumentById(TypeDocumentId);

    if (!TypeDocument) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(TypeDocument);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};


export const createTypeDocument = async (req, res) => {
  try {
    const TypeDocumentData = req.body;
    const newTypeDocument = await typeDocumentService.createTypeDocument(TypeDocumentData);
    res.status(200).json(newTypeDocument);
  } catch (err) {
    console.error("Error al querer agregar un nuevo Rol:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const updateTypeDocument = async (req, res) => {
  try {
    const TypeDocumentId = req.params.id;
    const TypeDocumentData = req.body;
    const updatedTypeDocument = await typeDocumentService.updateTypeDocument(
      TypeDocumentId,
      TypeDocumentData
    );
    if (!updatedTypeDocument) {
      return res.status(404).json({ message: "El Rol de usuario que quieres actualizar no existe" });
    }
    res.status(200).json(updatedTypeDocument);
  } catch (err) {
    console.error("Error al actualizar el Rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const deleteTypeDocument = async (req, res) => {
  try {
    const TypeDocumentId = req.params.id;
    const deleted = await typeDocumentService.deleteTypeDocument(TypeDocumentId);
    if (!deleted) {
      return res.status(404).json({ message: "El Rol que desea eliminar no existe" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error al eliminar un Role:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const searchTypeDocuments = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameters
    const TypeDocuments = await typeDocumentService.searchTypeDocuments(searchTerm);
    res.status(200).json(TypeDocuments);
  } catch (error) {
    console.error("Error al buscar un Rol:", error);
    res.status(500).json({ message: "Error del Servidor" });
  }
};
