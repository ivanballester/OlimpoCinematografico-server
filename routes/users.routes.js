const express = require("express");
const User = require("../models/User.model");

const router = express.Router();

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
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
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
      role,
    });

    const { _id } = createdUser;

    const user = { email, name, _id, role };

    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/users/:id", async (req, res, next) => {
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

module.exports = router;
