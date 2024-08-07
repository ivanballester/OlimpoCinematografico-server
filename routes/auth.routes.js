const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const router = express.Router();
const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;

  //Check if user provided not an empty slot
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Email, nombre y contraseña son requeridos." });
  }

  //Check if email has correct format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email no válido" });
  }

  //Check if password has correct format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener 6 caracteres mínimo, los cuales tiene que haber 1 mayúscula, 1 minúscula y 1 número",
    });
  }

  try {
    //Check if email is not already registered
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

    const { _id, role } = createdUser;

    const user = { email, name, _id, role };

    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  //Check if no empty slot
  if (!email || !password) {
    res.status(400).json({ message: "Proporciona un email y la contraseña" });
    return;
  }

  //Check if user exist

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "Email no encontrado" });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, name, role } = foundUser;

        const payload = { _id, email, name, role };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "10h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Usuario no identificado" });
      }
    })
    .catch((err) => res.status(500).json({ message: "internal server rror" }));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(`req.payload`, req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
