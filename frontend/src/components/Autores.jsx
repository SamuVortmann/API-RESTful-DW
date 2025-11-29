import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Autores({ onAutoresChanged }) {

  const [autores, setAutores] = useState([]);
  const [novoAutor, setNovoAutor] = useState({ nome: "" });

  useEffect(() => {
    async function carregarAutores() {
      const response = await api.get("/authors");
      setAutores(response.data);
    }
    carregarAutores();
  }, []);

  async function adicionarAutor() {
    if (!novoAutor.nome.trim()) return;

    await api.post("/authors", novoAutor);
    setNovoAutor({ nome: "" });

    const updated = await api.get("/authors");
    setAutores(updated.data);
    
    // Notifica que os autores foram modificados
    if (onAutoresChanged) {
      onAutoresChanged();
    }
  }

  return (
    <div className="section-card">
      <h2>Autores</h2>

      <input
        placeholder="Nome do autor"
        value={novoAutor.nome}
        onChange={(e) => setNovoAutor({ nome: e.target.value })}
      />

      <button onClick={adicionarAutor}>Adicionar</button>

      <ul>
        {autores.map((a) => (
          <li key={a.id}>{a.nome}</li>
        ))}
      </ul>
    </div>
  );
}
