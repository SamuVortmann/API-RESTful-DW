
// GET - Livros
async function pegarLivro(req, res){
    db.query("SELECT * FROM livros", (err, results) => {
        if (err) return res.status(500).json({error: err});
    });
}
// GET - Livro por id
async function pegarLivroId(req, res){
    const id = req.params.id;
    db.query("SELECT * FROM livros WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Livro não encontrado" });
        res.json(results[0]);
    });
}


// POST - Cria livro
async function criarLivro(req,res) {
    // valida o autor
    const {titulo, id_autor, ano} = req.body;
     db.query("SELECT * FROM authors WHERE id = ?", [authorId], (err, authorResults) => {
      if (authorResults.length === 0)
        return res.status(400).json({ error: "Autor não existe" });
    // insere no banco
      db.query("INSERT INTO books (title, authorId, year) VALUES (?, ?, ?)", [title, authorId, year], (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.status(201).json({
            id: result.insertId,
            title,
            authorId,
            year
          });
        });
    });
    
}