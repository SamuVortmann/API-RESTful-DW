
function errorHandler(err, req, res, next) {
  console.error(err);

  if (typeof err === "string") {
    return res.status(400).json({ error: err });
  }

  if (err && err.status) {
    return res.status(err.status).json({ error: err.message || "Erro" });
  }

  res.status(500).json({ error: "Erro interno no servidor" });
}

module.exports = errorHandler;
