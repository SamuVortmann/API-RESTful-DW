// validação para criação/atualização de autores
function validarAutor(req, res, next) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  if (typeof nome !== "string") {
    return res.status(400).json({ error: "Nome deve ser texto" });
  }

  const nomeLimpo = nome.trim();

  if (nomeLimpo.length < 3 || nomeLimpo.length > 80) {
    return res.status(400).json({ error: "Nome deve ter entre 3 e 80 caracteres" });
  }

  // permite letras (inclui acentos), espaços e pontos (ex: J. K. Rowling)
  if (!/^[A-Za-zÀ-ÿ\s\.]+$/.test(nomeLimpo)) {
    return res.status(400).json({ error: "Nome deve conter apenas letras, espaços e pontos" });
  }

  req.body.nome = nomeLimpo;
  next();
}

module.exports = validarAutor;
