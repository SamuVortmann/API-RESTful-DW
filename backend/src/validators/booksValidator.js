// Validador para POST (criar) - campos obrigatórios
function validarCriarLivro(req, res, next) {
  const { titulo, id_autor, ano } = req.body;

  // POST exige titulo e id_autor
  if (!titulo || id_autor === undefined) {
    return res.status(400).json({ 
      error: "Campos obrigatórios para criar livro: titulo, id_autor" 
    });
  }

  // Validação do título
  if (typeof titulo !== "string") {
    return res.status(400).json({ error: "O título deve ser texto" });
  }

  const tituloLimpo = titulo.trim();
  if (tituloLimpo.length < 3 || tituloLimpo.length > 200) {
    return res.status(400).json({ error: "Título deve ter entre 3 e 200 caracteres" });
  }

  // Validação do id_autor
  const idAutorNum = Number(id_autor);
  if (!Number.isInteger(idAutorNum) || idAutorNum <= 0) {
    return res.status(400).json({ error: "id_autor deve ser um número inteiro positivo" });
  }

  // Validação do ano (opcional)
  if (ano !== undefined && ano !== null && ano !== "") {
    const anoNum = Number(ano);
    if (!Number.isInteger(anoNum)) {
      return res.status(400).json({ error: "Ano deve ser um número inteiro" });
    }

    const anoAtual = new Date().getFullYear();
    if (anoNum < 1000 || anoNum > anoAtual) {
      return res.status(400).json({ error: `Ano deve estar entre 1000 e ${anoAtual}` });
    }

    req.body.ano = anoNum;
  }

  req.body.titulo = tituloLimpo;
  req.body.id_autor = idAutorNum;

  next();
}

// Validador para PUT (atualizar) - aceita atualização parcial
function validarAtualizarLivro(req, res, next) {
  const { titulo, id_autor, ano } = req.body;

  // PUT deve ter pelo menos um campo para atualizar
  if (titulo === undefined && id_autor === undefined && ano === undefined) {
    return res.status(400).json({ 
      error: "Envie pelo menos um campo para atualizar: titulo, id_autor ou ano" 
    });
  }

  // Validação do título (se fornecido)
  if (titulo !== undefined) {
    if (typeof titulo !== "string") {
      return res.status(400).json({ error: "O título deve ser texto" });
    }

    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length < 3 || tituloLimpo.length > 200) {
      return res.status(400).json({ error: "Título deve ter entre 3 e 200 caracteres" });
    }

    req.body.titulo = tituloLimpo;
  }

  // Validação do id_autor (se fornecido)
  if (id_autor !== undefined) {
    const idAutorNum = Number(id_autor);
    if (!Number.isInteger(idAutorNum) || idAutorNum <= 0) {
      return res.status(400).json({ error: "id_autor deve ser um número inteiro positivo" });
    }
    req.body.id_autor = idAutorNum;
  }

  // Validação do ano (se fornecido)
  if (ano !== undefined && ano !== null && ano !== "") {
    const anoNum = Number(ano);
    if (!Number.isInteger(anoNum)) {
      return res.status(400).json({ error: "Ano deve ser um número inteiro" });
    }

    const anoAtual = new Date().getFullYear();
    if (anoNum < 1000 || anoNum > anoAtual) {
      return res.status(400).json({ error: `Ano deve estar entre 1000 e ${anoAtual}` });
    }

    req.body.ano = anoNum;
  } else if (ano === null || ano === "") {
    // Permite definir ano como null
    req.body.ano = null;
  }

  next();
}

module.exports = {
  validarCriarLivro,
  validarAtualizarLivro
};
