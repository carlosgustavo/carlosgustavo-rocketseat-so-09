import React, { useState } from "react";
import api from "../../services/api";
import logo from "../../assets/logo.svg";
import "./styles.css";
export default function Login({ history }) {
  const [email, setEmail] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post("/sessions", { email });

    const { _id } = response.data;

    localStorage.setItem("user", _id);

    history.push("/dashboard");
  }

  return (
    <div className="container-man">
      <img src={logo} alt="Tindev" />

      <div className="login-container">
        <p>
          Ofereça <strong>spots</strong> para programadores e encontre{" "}
          <strong>talentos</strong> para sua empresa
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-MAIL *</label>
          <input
            id="email"
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}