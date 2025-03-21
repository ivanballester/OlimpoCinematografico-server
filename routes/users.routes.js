const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAdmin, isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/users", isAuthenticated, isAdmin, async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: "Este email ya ha sido registrado" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: createdUser });
  } catch (err) {
    next(err);
  }
});

router.get("/users/:id", isAdmin, isAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.patch("/users/:id", isAuthenticated, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, name, role },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,

  async (req, res, next) => {
    const { id } = req.params;

    try {
      await User.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
