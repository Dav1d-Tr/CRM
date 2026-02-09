import bcrypt from "bcrypt";
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {

  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    console.log("🔐 [LOGIN] Email recibido:", email);
    console.log("🔐 [LOGIN] Password length:", password.length);

    const user = await userService.getUserByEmail(email);

    if (!user) {
      console.log("❌ [LOGIN] Usuario no encontrado");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log("🔐 [LOGIN] Hash en BD:", user.password);

    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log("🔐 [LOGIN] bcrypt.compare →", isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const { password: _, ...safeUser } = user;

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      user: safeUser,
      token,
    });

  } catch (error) {
    console.error("🔥 [LOGIN] Error:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
