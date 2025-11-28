const db = require("../database/connection");

// listar todos os livros
function listarLivros() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, titulo, id_autor, ano FROM books ORDER BY titulo", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// pegar por id
function pegarLivroPorId(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, titulo, id_autor, ano FROM books WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
}

// verifica se autor existe
function verificarAutorExiste(id_autor) {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM authors WHERE id = ?", [id_autor], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
}

// cria livro (verifica autor)
async function criarLivro(titulo, id_autor, ano) {
  const autorExiste = await verificarAutorExiste(id_autor);
  if (!autorExiste) {
    const error = new Error("Autor não existe");
    error.status = 400;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const query = ano 
      ? "INSERT INTO books (titulo, id_autor, ano) VALUES (?, ?, ?)"
      : "INSERT INTO books (titulo, id_autor) VALUES (?, ?)";
    
    const values = ano ? [titulo, id_autor, ano] : [titulo, id_autor];
    
    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, titulo, id_autor, ano: ano || null });
    });
  });
}

// atualizar livro
async function atualizarLivro(id, campos) {
  // Verifica se o livro existe
  const livro = await pegarLivroPorId(id);
  if (!livro) {
    return false;
  }

  // Se está atualizando o autor, verifica se existe
  if (campos.id_autor !== undefined) {
    const autorExiste = await verificarAutorExiste(campos.id_autor);
    if (!autorExiste) {
      const error = new Error("Autor não existe");
      error.status = 400;
      throw error;
    }
  }

  const sets = [];
  const values = [];

  if (campos.titulo !== undefined) {
    sets.push("titulo = ?");
    values.push(campos.titulo);
  }

  if (campos.id_autor !== undefined) {
    sets.push("id_autor = ?");
    values.push(campos.id_autor);
  }

  if (campos.ano !== undefined) {
    if (campos.ano === null || campos.ano === "") {
      sets.push("ano = NULL");
    } else {
      sets.push("ano = ?");
      values.push(campos.ano);
    }
  }

  if (sets.length === 0) {
    return false;
  }

  values.push(id);

  const sql = `UPDATE books SET ${sets.join(", ")} WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function removerLivro(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = {
  listarLivros,
  pegarLivroPorId,
  criarLivro,
  atualizarLivro,
  removerLivro,
  verificarAutorExiste
};
