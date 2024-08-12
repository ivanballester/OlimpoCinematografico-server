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
    next(error);
  }
});

router.post(
  "/reviews/:id/comments",
  isAuthenticated,
  async (req, res, next) => {
    const { id } = req.params;
    const { text, rating } = req.body;
    const creator = req.payload._id;

    try {
      const newComment = await Comment.create({
        text,
        rating,
        creator,
        review: id,
      });

      await Review.findByIdAndUpdate(
        id,
        { $push: { comments: newComment._id } },
        { new: true, runValidators: true }
      );

      const updatedReview = await Review.findById(id).populate("comments");
      res.status(201).json(updatedReview);
    } catch (error) {
      next(error);
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
    next(error);
  }
});

module.exports = router;
