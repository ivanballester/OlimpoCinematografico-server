const router = require("express").Router();
const {
  isAdmin,
  isAuthenticated,
} = require("./../middleware/jwt.middleware.js");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const reviewRouter = require("./reviews.routes");
router.use("/reviews", reviewRouter);

const userRoutes = require("./users.routes");
router.use("/", isAdmin, isAuthenticated, userRoutes);

const authRouter = require("./auth.routes");
router.use("/", authRouter);

module.exports = router;
