import { useState } from "react";
import { authService } from "../services/api";

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await authService.login(formData.email, formData.password);
        onLoginSuccess(user);
      } else {
        await authService.register(formData.nome, formData.email, formData.password);
        // Após o registro, faz login automaticamente
        const { user } = await authService.login(formData.email, formData.password);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Registro"}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processando..." : isLogin ? "Entrar" : "Registrar"}
          </button>
        </form>

        <p>
          {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({ nome: "", email: "", password: "" });
            }}
          >
            {isLogin ? "Registre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}


