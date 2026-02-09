import * as userService from "../services/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos." });
    }

    const user = await userService.getUserByEmailWithRole(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    delete user.password;

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== VALIDACIONES ====== */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

/* ====== GET ====== */
export const getAllUser = async (req, res) => {
  try {
    const users = await userService.getAllUser();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Se requiere un ID de usuario." });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/* ====== CREATE ====== */
export const createUser = async (req, res) => {
  try {
    const {
      id,
      name,
      lastName,
      email,
      password,
      numberPhone,
      avatar,
      roleId,
      documentId,
    } = req.body;

    /* ---- Validaciones obligatorias ---- */
    if (
      !id ||
      !name ||
      !lastName ||
      !numberPhone ||
      !email ||
      !password ||
      !roleId ||
      !documentId
    ) {
      return res
        .status(400)
        .json({ message: "Campos obligatorios sin llenar." });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Correo electrónico no válido." });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y al menos un símbolo.",
      });
    }

    /* ---- ENCRIPTAR CONTRASEÑA ---- */
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      id,
      name,
      lastName,
      email,
      password: hashedPassword,
      numberPhone,
      avatar,
      roleId,
      documentId,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res
      .status(400)
      .json({ message: err.message || "Error del servidor al crear usuario." });
  }
};

/* ====== UPDATE ====== */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Se requiere un ID de usuario." });
    }

    const { email, password } = req.body;

    if (email && !isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Correo electrónico no válido." });
    }

    let dataToUpdate = { ...req.body };

    if (password) {
      if (!isValidPassword(password)) {
        return res
          .status(400)
          .json({ message: "La contraseña no es válida." });
      }

      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userService.updateUser(id, dataToUpdate);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado." });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res
      .status(500)
      .json({ message: "Error del servidor al actualizar usuario." });
  }
};

/* ====== DELETE ====== */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Se requiere un ID de usuario." });
    }

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res
      .status(500)
      .json({ message: "Error del servidor al eliminar usuario." });
  }
};

/* ====== SEARCH ====== */
export const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res
        .status(400)
        .json({ message: "Se requiere un término de búsqueda." });
    }

    const users = await userService.searchUser(searchTerm);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error al buscar usuarios:", err);
    res
      .status(500)
      .json({ message: "Error del servidor al buscar usuarios." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await userService.updatePasswordByEmail(
      email,
      hashedPassword
    );

    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Contraseña restablecida correctamente." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error del servidor." });
  }
};
