import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Autores({ onAutoresChanged }) {
  const [autores, setAutores] = useState([]);
  const [novoAutor, setNovoAutor] = useState({ nome: "" });
  const [editarAutor, setEditarAutor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarAutores();
  }, []);

  async function carregarAutores() {
    try {
      setLoading(true);
      const response = await api.get("/authors");
      setAutores(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao carregar autores");
    } finally {
      setLoading(false);
    }
  }

  async function adicionarAutor() {
    if (!novoAutor.nome.trim()) return;

    try {
      setError("");
      await api.post("/authors", { nome: novoAutor.nome });
      setNovoAutor({ nome: "" });
      await carregarAutores();
      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event("autoresChanged"));
      // Notifica callback se fornecido
      if (onAutoresChanged) {
        onAutoresChanged();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao adicionar autor");
    }
  }

  async function atualizarAutor() {
    if (!editarAutor.nome.trim()) return;

    try {
      setError("");
      await api.put(`/authors/${editarAutor.id}`, { nome: editarAutor.nome });
      setEditarAutor(null);
      await carregarAutores();
      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event("autoresChanged"));
      // Notifica callback se fornecido
      if (onAutoresChanged) {
        onAutoresChanged();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao atualizar autor");
    }
  }

  async function deletarAutor(id) {
    if (!confirm("Tem certeza que deseja excluir este autor? Não será possível se houver livros associados.")) return;

    try {
      setError("");
      await api.delete(`/authors/${id}`);
      await carregarAutores();
      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event("autoresChanged"));
      // Notifica callback se fornecido
      if (onAutoresChanged) {
        onAutoresChanged();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao deletar autor");
    }
  }

  return (
    <div className="section-card">
      <h2>Autores</h2>

      {error && <div className="error-message">{error}</div>}

      {!editarAutor && (
        <>
          <input
            placeholder="Nome do autor"
            value={novoAutor.nome}
            onChange={(e) => setNovoAutor({ nome: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && adicionarAutor()}
          />

          <button onClick={adicionarAutor} disabled={loading}>
            {loading ? "Processando..." : "Adicionar"}
          </button>
        </>
      )}

      {editarAutor && (
        <>
          <h3>Editando Autor</h3>
          <input
            placeholder="Nome do autor"
            value={editarAutor.nome}
            onChange={(e) => setEditarAutor({ ...editarAutor, nome: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && atualizarAutor()}
          />

          <button onClick={atualizarAutor} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={() => setEditarAutor(null)}>Cancelar</button>
        </>
      )}

      {loading && autores.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {autores.map((a) => (
            <li key={a.id}>
              <div>
                <strong>{a.nome}</strong>
              </div>
              <div className="action-buttons">
                <button onClick={() => setEditarAutor(a)}>Editar</button>
                <button className="btn-danger" onClick={() => deletarAutor(a.id)}>
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
