import {
  useState
} from "react"

import {
  createUserWithEmailAndPassword
} from "firebase/auth"

import {
  addDoc,
  collection
} from "firebase/firestore"

import {
  auth,
  db
} from "../services/firebase"

import "../styles/cadastroPaciente.css"

function CadastroPaciente({

  voltar

}) {

  const [tipo,
    setTipo] =
    useState("paciente")

  const [nome,
    setNome] =
    useState("")

  const [email,
    setEmail] =
    useState("")

  const [senha,
    setSenha] =
    useState("")

async function cadastrar(e) {

  e.preventDefault()

  try {

    const usuario =
      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      )

    // Cadastro do usuário
    await addDoc(
      collection(db, "usuarios"),
      {
        uid: usuario.user.uid,
        nome,
        email,
        tipo
      }
    )

    // Cadastro do paciente
    if (tipo === "paciente") {

      await addDoc(
        collection(db, "pacientes"),
        {
          nome,
          email,
          telefone: "",
          foto: "",
          obs: "",
          proxConsulta: "",
          totalPago: 0
        }
      )

    }

    alert("Cadastro realizado!")

    voltar()

  } catch (error) {

    console.log(error)

    alert(
      "Erro ao cadastrar."
    )

  }

}

  return (

    <main className="cadastro-container">

      <form
        className="cadastro-box"
        onSubmit={cadastrar}
      >

        <button
          type="button"
          onClick={voltar}
        >

          ← Voltar

        </button>

        <h1>
          Cadastro de Paciente
        </h1>

        <div className="tipo-box">

          <button

            type="button"

            className={
              tipo === "paciente"
              ? "ativo"
              : ""
            }

            onClick={() =>
              setTipo(
                "paciente"
              )
            }

          >

            Paciente

          </button>

          <button

            type="button"

            className={
              tipo === "auxiliar"
              ? "ativo"
              : ""
            }

            onClick={() =>
              setTipo(
                "auxiliar"
              )
            }

          >

            Auxiliar

          </button>

        </div>

        <input

          placeholder="Nome"

          value={nome}

          onChange={(e) =>
            setNome(
              e.target.value
            )
          }

        />

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

        <button type="submit">

          Cadastrar

        </button>

      </form>

    </main>

  )

}

export default CadastroPaciente;