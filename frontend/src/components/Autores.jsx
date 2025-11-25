import { useState, useEffect } from "react";
import { api } from "../services/api";


export default function Autores() {
const [autores, setAutores] = useState([]);
const [novoAutor, setNovoAutor] = useState({ name: "" });


useEffect(() => {
async function carregarAutores() {
const response = await api.get("/autores");
setAutores(response.data);
}
carregarAutores();
}, []);


async function adicionarAutor() {
if (!novoAutor.name.trim()) return;
await api.post("/autores", novoAutor);
setNovoAutor({ name: "" });
const updated = await api.get("/autores");
setAutores(updated.data);
}


return (
<div>
<h2>Autores</h2>
<input
placeholder="Nome do autor"
value={novoAutor.name}
onChange={(e) => setNovoAutor({ name: e.target.value })}
/>
<button onClick={adicionarAutor}>Adicionar</button>


<ul>
{autores.map((a) => (
<li key={a.id}>{a.name}</li>
))}
</ul>
</div>
);
}