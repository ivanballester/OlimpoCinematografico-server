const express = require("express");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();

router.get("/profile", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const profile = await User.findById(_id);

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//
router.patch("/profile", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;
  const { name, password, photo, phoneNumber } = req.body;

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

    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
