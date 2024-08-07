const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload;
    console.log("Token validado, payload:", payload);

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.payload.role === "admin") {
    next();
  } else {
    res
      .status(401)
      .json({ errorMessage: "No puedes acceder porque no eres admin" });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
