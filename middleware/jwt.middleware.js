const jwt = require("jsonwebtoken");

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Verifica que el encabezado Authorization esté presente
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1]; // Extrae el token del encabezado

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token no proporcionado o no válido" });
    }

    // Verifica el token y establece el payload en req.payload
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload; // Establece el payload en req.payload

    next(); // Continúa al siguiente middleware o ruta
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

// Middleware para verificar si el usuario es un admin
const isAdmin = (req, res, next) => {
  if (req.payload && req.payload.role === "admin") {
    return next(); // Continúa si el usuario es admin
  }

  res.status(403).json({ message: "Acceso denegado. No eres admin" });
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
