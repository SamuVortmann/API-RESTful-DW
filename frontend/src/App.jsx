import { useState, useEffect } from "react";
import Autores from "./components/Autores";
import Livros from "./components/Livros";
import Auth from "./components/Auth";
import { authService } from "./services/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoresKey, setAutoresKey] = useState(0); // Key para forçar atualização

  useEffect(() => {
    // Verifica se o usuário já está logado
    if (authService.isAuthenticated()) {
      authService.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          authService.logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Callback para quando autores forem modificados
  const handleAutoresChanged = () => {
    setAutoresKey(prev => prev + 1); // Força atualização do componente Livros
  };

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Inventário de Livros e Autores</h1>
        <div className="user-info">
          <span>Olá, {user?.nome || user?.email}!</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </div>

      <Autores onAutoresChanged={handleAutoresChanged} />
      <hr />
      <Livros key={autoresKey} />
    </div>
  );
}
