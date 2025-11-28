
const db = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10);

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function registerUser(nome, email, password) {
  const exists = await query("SELECT id FROM users WHERE email = ?", [email]);
  if (exists.length) throw { status: 400, message: "Email já cadastrado" };

  const hash = await bcrypt.hash(password, 10);

  const result = await query(
    "INSERT INTO users (nome, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())",
    [nome, email, hash, "user"]
  );

  return { id: result.insertId, nome, email, role: "user" };
}

async function authenticateUser(email, password) {
  const rows = await query("SELECT id, nome, email, password_hash, role FROM users WHERE email = ?", [email]);
  if (!rows.length) throw { status: 400, message: "Credenciais inválidas" };

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw { status: 400, message: "Credenciais inválidas" };

  const accessToken = generateAccessToken({ id: user.id, nome: user.nome, email: user.email, role: user.role });
  const refreshToken = await generateAndStoreRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, nome: user.nome, email: user.email, role: user.role }
  };
}

function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

async function generateAndStoreRefreshToken(userId) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES (?, ?, ?, NOW())",
    [userId, token, expiresAt]
  );

  return token;
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw { status: 401, message: "Refresh token ausente" };

  const rows = await query(
    "SELECT rt.id, rt.user_id, rt.expires_at, u.nome, u.email, u.role FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id WHERE rt.token = ?",
    [refreshToken]
  );

  if (!rows.length) throw { status: 401, message: "Refresh token inválido" };

  const tokenRow = rows[0];
  if (new Date(tokenRow.expires_at) < new Date()) {
    await query("DELETE FROM refresh_tokens WHERE id = ?", [tokenRow.id]);
    throw { status: 401, message: "Refresh token expirado" };
  }

  const payload = { id: tokenRow.user_id, nome: tokenRow.nome, email: tokenRow.email, role: tokenRow.role };
  const accessToken = generateAccessToken(payload);
  return { accessToken, user: payload };
}

async function revokeRefreshToken(refreshToken) {
  await query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
  return;
}

async function getUserById(id) {
  const rows = await query("SELECT id, nome, email, role, created_at FROM users WHERE id = ?", [id]);
  if (!rows.length) return null;
  return rows[0];
}

module.exports = {
  registerUser,
  authenticateUser,
  refreshAccessToken,
  revokeRefreshToken,
  getUserById
};
