// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Formato do token inválido" });

  const token = parts[1];

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // anexa usuário ao req
    req.user = { id: payload.id, nome: payload.nome, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;
