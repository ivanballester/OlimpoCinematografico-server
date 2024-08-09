const router = require("express").Router();
const { isAdmin, isAuthenticated } = require("../middleware/jwt.middleware.js");

const Review = require("../models/Review.model");

router.get("/reviews", async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});
router.post("/reviews", isAuthenticated, isAdmin, async (req, res, next) => {
  const { text, rating, movieId } = req.body;
  const creator = req.payload._id;

  try {
    const newReview = await Review.create({ text, rating, creator, movieId });
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    next(error);
  }
});

router.get("/reviews/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/reviews/:id",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { id } = req.params;
    const { text, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La calificación debe estar entre 1 y 5" });
    }

    try {
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { text, rating },
        { new: true }
      );
      if (!updatedReview) {
        return res.status(404).json({ message: "Reseña no encontrada" });
      }
      res.status(200).json(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/reviews/:id",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) {
        return res.status(404).json({ message: "Reseña no encontrada" });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/reviews/:id/comments", async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id).populate({
      path: "comments",
      populate: {
        path: "creator",
        select: "name email",
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review no encontrada" });
    }

    res.status(200).json(review.comments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
