import Autores from "./components/Autores";
import Livros from "./components/Livros";


export default function App() {
return (
<div style={{ padding: 20 }}>
<h1>Inventário de Livros e Autores</h1>


<Autores />
<hr />
<Livros />
</div>
);
}