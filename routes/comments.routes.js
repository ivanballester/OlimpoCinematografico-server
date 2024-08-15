const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const Comment = require("../models/Comment.model");
const Review = require("../models/Review.model");
const { mongoose } = require("mongoose");

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

      const populatedComment = await Comment.findById(newComment._id).populate(
        "creator"
      );

      await Review.findByIdAndUpdate(
        id,
        { $push: { comments: newComment._id } },
        { new: true, runValidators: true }
      );

      const updatedReview = await Review.findById(id).populate({
        path: "comments",
        populate: {
          path: "creator",
          select: "name email",
        },
      });

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

    if (comment.creator.equals(userId) || req.payload.role === "admin") {
      await Review.updateOne({ comments: id }, { $pull: { comments: id } });

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
