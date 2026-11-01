import {
  useState
} from "react"

import "../styles/login.css"

import logob from "../assets/logob.png"
import fotoAline from "../assets/alinerelogio.jpeg"
import cartas from "../assets/cartas.png"
import xicaraRosa from "../assets/xicarar.png"
import relogioBolso from "../assets/relogiobolso.png"

function Login({
  voltar,
  entrar
}) {
  const [
    email,
    setEmail
  ] = useState("")

  const [
    senha,
    setSenha
  ] = useState("")

  const [
    mostrarSenha,
    setMostrarSenha
  ] = useState(false)

  function fazerLogin() {
    if (
      email === "dentalinew@gmail.com" &&
      senha === "dental@aline"
    ) {
      entrar()
    } else {
      alert("Login inválido")
    }
  }

  return (
    <main className="login-container">

      <header className="login-topo">
        <button
          type="button"
          className="login-voltar"
          onClick={voltar}
        >
          <span aria-hidden="true">←</span>
          Voltar para Home
        </button>

        <div className="login-marca">
          <span>Dentaline Wonderland</span>
          <img
            src={logob}
            className="login-logo-topo"
            alt="Logo Dentaline Wonderland"
          />
        </div>
      </header>

      <div className="login-elementos-fundo" aria-hidden="true">
        <img
          src={cartas}
          className="login-fundo-cartas"
          alt=""
        />

        <img
          src={relogioBolso}
          className="login-fundo-relogio"
          alt=""
        />

        <img
          src={xicaraRosa}
          className="login-fundo-xicara"
          alt=""
        />
      </div>

      <section className="login-box">

        <aside className="login-lateral">
          <img
            src={fotoAline}
            className="login-foto-fundo"
            alt=""
            aria-hidden="true"
          />

          <div className="login-foto-sombra" />

          <div className="login-lateral-conteudo">
            <span className="login-lateral-etiqueta">
              DENTALINE WONDERLAND
            </span>

            <h1>
              Um consultório
              <br />
              mágico
            </h1>

            <p>
              Cuidado e imaginação para receber cada sorriso
              com carinho.
            </p>
          </div>
        </aside>

        <div className="login-form-painel">
          <div className="login-cabecalho">
            <span className="login-etiqueta">
              ACESSO À PLATAFORMA
            </span>

            <h2>Login</h2>

            <p>
              Entre na sua conta para continuar.
            </p>
          </div>

          <div className="login-formulario">
            <label htmlFor="login-email">
              E-mail
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="username"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label htmlFor="login-senha">
              Senha
            </label>

            <div className="login-senha-campo">
              <input
                id="login-senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />

              <button
                type="button"
                className="login-mostrar-senha"
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                aria-pressed={mostrarSenha}
                title={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />

                  {!mostrarSenha && (
                    <path d="M4 4l16 16" />
                  )}
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="login-entrar"
              onClick={fazerLogin}
            >
              Entrar
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

      </section>

      <footer className="login-rodape">
        <span>Dentaline Wonderland</span>
        <span>Um consultório mágico</span>
      </footer>

    </main>
  )
}

export default Login