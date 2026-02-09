import * as customerService from "../services/customerService.js";

export const getAllCustomer = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomer();
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de cliente." });

    const customer = await customerService.getCustomerById(id);
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado." });

    res.status(200).json(customer);
  } catch (err) {
    console.error("Error al obtener cliente:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { id, name, countryId, cityId } = req.body;

    if (!id || !name || !countryId || !cityId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error("Error al crear cliente:", err);
    res.status(400).json({ message: err.message || "Error del servidor al crear cliente." });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de cliente." });

    const updatedCustomer = await customerService.updateCustomer(id, req.body);
    if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado." });

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    res.status(500).json({ message: "Error del servidor al actualizar cliente." });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de cliente." });

    const deleted = await customerService.deleteCustomer(id);
    if (!deleted) return res.status(404).json({ message: "Cliente no encontrado." });

    res.status(200).json({ message: "Cliente eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar cliente:", err);
    res.status(500).json({ message: "Error del servidor al eliminar cliente." });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) return res.status(400).json({ message: "Se requiere un término de búsqueda." });

    const customers = await customerService.searchCustomer(searchTerm);
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error al buscar clientes:", err);
    res.status(500).json({ message: "Error del servidor al buscar clientes." });
  }
};

export const patchCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de cliente." });

    const updatedCustomer = await customerService.updateCustomer(id, req.body);

    if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado." });

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error("Error al actualizar cliente (PATCH):", err);
    res.status(500).json({ message: "Error del servidor al actualizar cliente." });
  }
};
