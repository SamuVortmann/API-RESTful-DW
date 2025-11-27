import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Livros() {

  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);

  const [novoLivro, setNovoLivro] = useState({ title: "", authorId: "" });
  const [editarLivro, setEditarLivro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const [resLivros, resAutores] = await Promise.all([
        api.get("/livros"),
        api.get("/autores"),
      ]);
      setLivros(resLivros.data);
      setAutores(resAutores.data);
    }
    carregarDados();
  }, []);

  async function criarLivro() {
    if (!novoLivro.title || !novoLivro.authorId) return;
    await api.post("/livros", novoLivro);
    setNovoLivro({ title: "", authorId: "" });
    const response = await api.get("/livros");
    setLivros(response.data);
  }

  async function atualizarLivro() {
    await api.put(`/livros/${editarLivro.id}`, editarLivro);
    setEditarLivro(null);
    const response = await api.get("/livros");
    setLivros(response.data);
  }

  async function deletarLivro(id) {
    await api.delete(`/livros/${id}`);
    const response = await api.get("/livros");
    setLivros(response.data);
  }

  return (
    <div className="section-card">

      {!editarLivro && (
        <>
          <h2>Livros</h2>

          <input
            placeholder="Título do livro"
            value={novoLivro.title}
            onChange={(e) =>
              setNovoLivro({ ...novoLivro, title: e.target.value })
            }
          />

          <select
            value={novoLivro.authorId}
            onChange={(e) =>
              setNovoLivro({
                ...novoLivro,
                authorId: Number(e.target.value),
              })
            }
          >
            <option value="">Selecione o autor</option>
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.name}
              </option>
            ))}
          </select>

          <button onClick={criarLivro}>Criar Livro</button>
        </>
      )}

      {editarLivro && (
        <>
          <h2>Editando Livro</h2>

          <input
            value={editarLivro.title}
            onChange={(e) =>
              setEditarLivro({ ...editarLivro, title: e.target.value })
            }
          />

          <select
            value={editarLivro.authorId}
            onChange={(e) =>
              setEditarLivro({
                ...editarLivro,
                authorId: Number(e.target.value),
              })
            }
          >
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.name}
              </option>
            ))}
          </select>

          <button onClick={atualizarLivro}>Salvar</button>
          <button onClick={() => setEditarLivro(null)}>Cancelar</button>
        </>
      )}

      <ul>
        {livros.map((livro) => (
          <li key={livro.id}>
            <div>
              <strong>{livro.title}</strong> —{" "}
              {autores.find((a) => a.id === livro.authorId)?.name}
            </div>

            <div className="action-buttons">
              <button onClick={() => setEditarLivro(livro)}>Editar</button>
              <button className="btn-danger" onClick={() => deletarLivro(livro.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
