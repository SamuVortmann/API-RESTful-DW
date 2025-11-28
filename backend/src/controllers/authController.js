
const authService = require("../services/authService");

// POST
async function register(req, res, next) {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password) return res.status(400).json({ error: "nome, email e password são obrigatórios" });

  try {
    const user = await authService.registerUser(nome.trim(), email.trim().toLowerCase(), password);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

// POST
async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

  try {
    const { accessToken, refreshToken, user } = await authService.authenticateUser(email.trim().toLowerCase(), password);
    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
}

// POST
async function refresh(req, res, next) {
  const { refreshToken } = req.body;
  try {
    const payload = await authService.refreshAccessToken(refreshToken);
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

// POST
async function logout(req, res, next) {
  const { refreshToken } = req.body;
  try {
    await authService.revokeRefreshToken(refreshToken);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET
async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me };
