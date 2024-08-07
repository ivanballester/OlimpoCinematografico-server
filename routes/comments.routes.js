const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Comment = require("../models/Comment.model");
const Review = require("../models/Review.model");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/comments", async (req, res, next) => {
  try {
    const comments = await Comment.find().populate("creator", "name email");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error while fetching Comments", error);
    res.status(500).json({ message: "Error while fetching Comments" });
  }
});
router.post(
  "/reviews/:id/comments",
  isAuthenticated,
  async (req, res, next) => {
    const { id } = req.params;
    const { text, rating } = req.body;
    const creator = req.payload._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reseña no válido" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La calificación debe estar entre 1 y 5" });
    }

    try {
      const newComment = await Comment.create({ text, creator, review: id });

      await Review.findByIdAndUpdate(id, {
        $push: { comments: newComment._id },
      });

      res
        .status(201)
        .json({ message: "Comentario creado con éxito", comment: newComment });
    } catch (error) {
      console.error("Error al crear el comentario", error);
      res.status(500).json({ message: "Error al crear el comentario" });
    }
  }
);

router.delete("/comments/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.creator.equals(userId) || req.payload.role === "admin") {
      await Comment.findByIdAndDelete(id);
      res.status(204).json();
    } else {
      res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este comentario" });
    }
  } catch (error) {
    console.error("Error while deleting Comment", error);
    res.status(500).json({ message: "Error while deleting Comment" });
  }
});

module.exports = router;
