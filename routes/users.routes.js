const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated, isAdmin } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/users", async (req, res, next) => {
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

    const { _id } = createdUser;

    const user = { email, name, _id };

    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/users/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.patch("/users/:id", async (req, res, next) => {
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
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/users/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(204).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get(
  "/users/profile",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    const { _id } = req.payload;

    try {
      const profile = await User.findById(_id);
      res.status(200).json(profile);
    } catch (error) {
      console.log(error);
    }
  }
);
router.patch("/users/profile", async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const profile = await User.findByIdAndUpdate(
      _id,
      {
        name,
        password,
        photo,
        phoneNumber,
      },
      { new: true }
    );
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
