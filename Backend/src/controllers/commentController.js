import * as CommentService from "../services/commentService.js";

export const getAllComment = async (req, res) => {
  try {
    const Comments = await CommentService.getAllComment();
    res.status(200).json(Comments);
  } catch (err) {
    console.error("Error al obtener Comments:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de Comment." });

    const Comment = await CommentService.getCommentById(id);
    if (!Comment) return res.status(404).json({ message: "Comment no encontrado." });

    res.status(200).json(Comment);
  } catch (err) {
    console.error("Error al obtener Comment:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { observations, leadId } = req.body;
    const userId = req.user.id; 

    if (!observations || !leadId) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const newComment = await CommentService.createComment({
      observations,
      leadId,
      userId,
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error al crear comment:", err);
    res.status(500).json({ message: "Error del servidor." });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de Comment." });

    const updatedComment = await CommentService.updateComment(id, req.body);
    if (!updatedComment) return res.status(404).json({ message: "Comment no encontrado." });

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error("Error al actualizar Comment:", err);
    res.status(500).json({ message: "Error del servidor al actualizar Comment." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Se requiere un ID de Comment." });

    const deleted = await CommentService.deleteComment(id);
    if (!deleted) return res.status(404).json({ message: "Comment no encontrado." });

    res.status(200).json({ message: "Comment eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar Comment:", err);
    res.status(500).json({ message: "Error del servidor al eliminar Comment." });
  }
};


export const getCommentsByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;

    const comments = await CommentService.getCommentsByLeadId(leadId);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
