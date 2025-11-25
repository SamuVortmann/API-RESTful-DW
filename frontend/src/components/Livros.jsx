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
    <div>

      {/* CRIAR */}
      {!editarLivro && (
        <div>
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
        </div>
      )}

      {/* FORM DE EDITAR */}
      {editarLivro && (
        <div>
          <h3>Editando Livro</h3>

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
        </div>
      )}

      {/* LISTA DE LIVROS */}
      <ul>
        {livros.map((livro) => (
          <li key={livro.id}>
            <strong>{livro.title}</strong> —{" "}
            {autores.find((a) => a.id === livro.authorId)?.name}

            <button onClick={() => setEditarLivro(livro)}>Editar</button>
            <button onClick={() => deletarLivro(livro.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
