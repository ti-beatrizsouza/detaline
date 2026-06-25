import {

  useState

} from "react"

import "../styles/login.css"

function Login({

  voltar,
  entrar

}) {

  const [email,
    setEmail] =
    useState("")

  const [senha,
    setSenha] =
    useState("")

  function fazerLogin() {

    if (

      email ===
      "dentalinew@gmail.com"

      &&

      senha ===
      "dental@aline"

    ) {

      entrar()

    } else {

      alert(
        "Login inválido"
      )

    }

  }

  return (

    <main className="login-container">

      <div
        className="login-box"
      >

        <div
          onClick={voltar}
          style={{
            width: "100%",
            height: "55px",
            backgroundColor: "#ffffff",
            color: "#b30086",
            border: "2px solid #f0d3e8",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none"
          }}
        >

          ← Voltar

        </div>

        <h1>
          Login
        </h1>

        <input

          type="email"

          placeholder="E-mail"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

        />

        <input

          type="password"

          placeholder="Senha"

          value={senha}

          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }

        />

        <button
          type="button"
          onClick={fazerLogin}
        >

          Entrar

        </button>

      </div>

    </main>

  )

}

export default Login