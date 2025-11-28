
function validarLivro(req, res, next) {
  const { titulo, id_autor, ano } = req.body;

  if (!titulo || id_autor === undefined || ano === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios: titulo, id_autor, ano" });
  }

  if (typeof titulo !== "string") {
    return res.status(400).json({ error: "O título deve ser texto" });
  }

  const tituloLimpo = titulo.trim();
  if (tituloLimpo.length < 3 || tituloLimpo.length > 200) {
    return res.status(400).json({ error: "Título deve ter entre 3 e 200 caracteres" });
  }

  const idAutorNum = Number(id_autor);
  if (!Number.isInteger(idAutorNum) || idAutorNum <= 0) {
    return res.status(400).json({ error: "id_autor deve ser um número inteiro positivo" });
  }

  const anoNum = Number(ano);
  if (!Number.isInteger(anoNum)) {
    return res.status(400).json({ error: "Ano deve ser um número inteiro" });
  }

  const anoAtual = new Date().getFullYear();
  if (anoNum < 1000 || anoNum > anoAtual) {
    return res.status(400).json({ error: `Ano deve estar entre 1000 e ${anoAtual}` });
  }

  req.body.titulo = tituloLimpo;
  req.body.id_autor = idAutorNum;
  req.body.ano = anoNum;

  next();
}

module.exports = validarLivro;
