import * as userRoleService from "../services/userRoleService.js";


export const getAlluserRoles = async (req, res) => {
    try {
        const userRoles = await userRoleService.getAlluserRoles();
        res.status(200).json(userRoles);
    } catch (err) { 
        console.error('Error fetching userRoles:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getuserRoleById = async (req, res) => {
  try {
    const userRoleId = req.params.id;

    const userRole = await userRoleService.getuserRoleById(userRoleId);

    if (!userRole) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(userRole);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};


export const createuserRole = async (req, res) => {
    try {
        const userRoleData = req.body;
        const newuserRole = await userRoleService.createuserRole(userRoleData);
        res.status(200).json(newuserRole);
    } catch (err) { 
        console.error('Error adding userRole:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateuserRole = async (req, res) => {
    try {
        const userRoleId = req.params.id;
        const userRoleData = req.body;
        const updateduserRole = await userRoleService.updateuserRole(userRoleId, userRoleData);
        if (!updateduserRole) {
            return res.status(404).json({ message: 'userRole not found' });
        }
        res.status(200).json(updateduserRole);

    } catch (err) { 
        console.error('Error updating userRole:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const deleteuserRole = async (req, res) => {
    try {
        const userRoleId = req.params.id;
        const deleted = await userRoleService.deleteuserRole(userRoleId);
        if (!deleted) {
        return res.status(404).json({ message: 'userRole not found' });
        }

        res.status(200).send();

    } catch (err) { 
        console.error('Error deleting userRole:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const searchuserRoles = async (req, res) => {
    try {
      const searchTerm = req.query.q; // Get the search term from the query parameters
      const userRoles = await userRoleService.searchuserRoles(searchTerm);
      res.status(200).json(userRoles);
    } catch (error) {
      console.error('Error searching userRoles:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  