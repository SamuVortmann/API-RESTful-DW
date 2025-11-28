import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);

  const [novoLivro, setNovoLivro] = useState({ titulo: "", id_autor: "", ano: "" });
  const [editarLivro, setEditarLivro] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarDados() {
    try {
      setLoading(true);
      setError("");
      const [resLivros, resAutores] = await Promise.all([
        api.get("/books"),
        api.get("/authors"),
      ]);
      setLivros(resLivros.data);
      setAutores(resAutores.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  // Função para recarregar apenas os autores
  async function recarregarAutores() {
    try {
      const response = await api.get("/authors");
      setAutores(response.data);
    } catch (err) {
      console.error("Erro ao recarregar autores:", err);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Escuta eventos customizados para atualizar autores
  useEffect(() => {
    const handleAutoresChanged = () => {
      recarregarAutores();
    };

    window.addEventListener("autoresChanged", handleAutoresChanged);
    return () => {
      window.removeEventListener("autoresChanged", handleAutoresChanged);
    };
  }, []);

  async function criarLivro() {
    if (!novoLivro.titulo || !novoLivro.id_autor) {
      setError("Título e autor são obrigatórios");
      return;
    }

    try {
      setError("");
      const payload = {
        titulo: novoLivro.titulo,
        id_autor: Number(novoLivro.id_autor),
        ...(novoLivro.ano && { ano: Number(novoLivro.ano) })
      };
      await api.post("/books", payload);
      setNovoLivro({ titulo: "", id_autor: "", ano: "" });
      await carregarDados();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar livro");
    }
  }

  async function atualizarLivro() {
    try {
      setError("");
      const payload = {
        titulo: editarLivro.titulo,
        id_autor: Number(editarLivro.id_autor),
        ...(editarLivro.ano && { ano: Number(editarLivro.ano) })
      };
      await api.put(`/books/${editarLivro.id}`, payload);
      setEditarLivro(null);
      await carregarDados();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao atualizar livro");
    }
  }

  async function deletarLivro(id) {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
      setError("");
      await api.delete(`/books/${id}`);
      await carregarDados();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao deletar livro");
    }
  }

  return (
    <div className="section-card">
      {error && <div className="error-message">{error}</div>}

      {!editarLivro && (
        <>
          <h2>Livros</h2>

          <input
            placeholder="Título do livro"
            value={novoLivro.titulo}
            onChange={(e) =>
              setNovoLivro({ ...novoLivro, titulo: e.target.value })
            }
          />

          <select
            value={novoLivro.id_autor}
            onChange={(e) =>
              setNovoLivro({
                ...novoLivro,
                id_autor: e.target.value,
              })
            }
          >
            <option value="">Selecione o autor</option>
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.nome}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Ano (opcional)"
            value={novoLivro.ano}
            onChange={(e) =>
              setNovoLivro({ ...novoLivro, ano: e.target.value })
            }
          />

          <button onClick={criarLivro} disabled={loading}>
            {loading ? "Processando..." : "Criar Livro"}
          </button>
        </>
      )}

      {editarLivro && (
        <>
          <h2>Editando Livro</h2>

          <input
            placeholder="Título do livro"
            value={editarLivro.titulo}
            onChange={(e) =>
              setEditarLivro({ ...editarLivro, titulo: e.target.value })
            }
          />

          <select
            value={editarLivro.id_autor}
            onChange={(e) =>
              setEditarLivro({
                ...editarLivro,
                id_autor: e.target.value,
              })
            }
          >
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.nome}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Ano (opcional)"
            value={editarLivro.ano || ""}
            onChange={(e) =>
              setEditarLivro({ ...editarLivro, ano: e.target.value })
            }
          />

          <button onClick={atualizarLivro} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={() => setEditarLivro(null)}>Cancelar</button>
        </>
      )}

      {loading && livros.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {livros.map((livro) => (
            <li key={livro.id}>
              <div>
                <strong>{livro.titulo}</strong>
                {livro.ano && ` (${livro.ano})`} —{" "}
                {autores.find((a) => a.id === livro.id_autor)?.nome}
              </div>

              <div className="action-buttons">
                <button onClick={() => setEditarLivro(livro)}>Editar</button>
                <button className="btn-danger" onClick={() => deletarLivro(livro.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
