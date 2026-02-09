import * as contactService from "../services/contactService.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getAllContact = async (req, res) => {
  try {
    const Contacts = await contactService.getAllContact();
    res.status(200).json(Contacts);
  } catch (err) {
    console.error("Error al obtener contactos:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de contacto." });

    const Contact = await contactService.getContactById(id);
    if (!Contact) return res.status(404).json({ message: "contacto no encontrado." });

    res.status(200).json(Contact);
  } catch (err) {
    console.error("Error al obtener contacto:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { id, name, numberPhone, email, customerId} = req.body;

    if (!id || !name || !numberPhone || !email || !customerId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido." });
    }

    const newContact = await contactService.createContact(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Error al crear contacto:", err);
    res.status(400).json({ message: err.message || "Error del servidor al crear contacto." });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de contacto." });

    const { email } = req.body;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido." });
    }

    const updatedContact = await contactService.updateContact(id, req.body);
    if (!updatedContact) return res.status(404).json({ message: "contacto no encontrado." });

    res.status(200).json(updatedContact);
  } catch (err) {
    console.error("Error al actualizar contacto:", err);
    res.status(500).json({ message: "Error del servidor al actualizar contacto." });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de contacto." });

    const deleted = await contactService.deleteContact(id);
    if (!deleted) return res.status(404).json({ message: "contacto no encontrado." });

    res.status(200).json({ message: "contacto eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar contacto:", err);
    res.status(500).json({ message: "Error del servidor al eliminar contacto." });
  }
};

export const searchContact = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) return res.status(400).json({ message: "Se requiere un término de búsqueda." });

    const Contacts = await contactService.searchContact(searchTerm);
    res.status(200).json(Contacts);
  } catch (err) {
    console.error("Error al buscar contactos:", err);
    res.status(500).json({ message: "Error del servidor al buscar contactos." });
  }
};

export const patchContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de contacto." });

    const { email } = req.body;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido." });
    }

    const updatedContact = await contactService.updateContact(id, req.body);

    if (!updatedContact) return res.status(404).json({ message: "contacto no encontrado." });

    res.status(200).json(updatedContact);
  } catch (err) {
    console.error("Error al actualizar contacto (PATCH):", err);
    res.status(500).json({ message: "Error del servidor al actualizar contacto." });
  }
};

export const getContactByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "customerId es requerido" });
    }

    const contact =
      await contactService.getContactByCustomerId(customerId);

    if (!contact) {
      return res.status(404).json(null);
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error("Error obteniendo contacto por cliente:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getContactsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "customerId es requerido" });
    }

    const contacts = await contactService.getContactsByCustomerId(customerId);
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error obteniendo contactos:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
