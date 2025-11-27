import Autores from "./components/Autores";
import Livros from "./components/Livros";

export default function App() {
  return (
    <div className="container">
      <h1>Inventário de Livros e Autores</h1>

      <Autores />
      <hr />
      <Livros />
    </div>
  );
}
