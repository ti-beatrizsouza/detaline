import { useState } from "react"

import {
  addDoc,
  collection
} from "firebase/firestore"

import { db } from "../services/firebase"

import "../styles/cadastroDentista.css"

function CadastroDentista({

  voltar

}) {

  const [nome, setNome] =
    useState("")

  const [telefone, setTelefone] =
    useState("")

  const [idade, setIdade] =
    useState("")

  const [
    nomeResponsavel,
    setNomeResponsavel
  ] = useState("")

  const [
    cpfResponsavel,
    setCpfResponsavel
  ] = useState("")

  const [
    telefoneResponsavel,
    setTelefoneResponsavel
  ] = useState("")

  const [obs, setObs] =
    useState("")

  const [fotoNome, setFotoNome] =
    useState("")

  async function cadastrar(e) {

    e.preventDefault()

    try {

      await addDoc(
        collection(
          db,
          "pacientes"
        ),
        {

          nome,

          foto: "",

          idade:
            Number(idade),

          tel: telefone,

          responsavel:
            nomeResponsavel,

          telResponsavel:
            telefoneResponsavel,

          cpfResponsavel,

          obs,

          totalPago: 0,

          timeline: []

        }
      )

      alert(
        "Paciente cadastrado!"
      )

      voltar()

    } 
    
    catch (error) {

  console.error(error)

  alert(
`Código:
${error.code}

Mensagem:
${error.message}`
  )

}

  }

  return (

    <main className="cadastro-dentista-container">

      <form
        className="cadastro-dentista-box"
        onSubmit={cadastrar}
      >

        <button
          type="button"
          className="voltar-btn"
          onClick={voltar}
        >

          ← Voltar

        </button>

        <h1>
          Cadastro de Paciente
        </h1>

        <div className="foto-box">

          <div className="foto-preview">

            {fotoNome
              ? "📷"
              : "👤"}

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFotoNome(
                e.target
                  .files?.[0]
                  ?.name || ""
              )
            }
          />

          {fotoNome && (

            <small>

              {fotoNome}

            </small>

          )}

        </div>

        <div className="form-grid">

          <input
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            required
          />

          <input
            placeholder="Telefone do paciente"
            value={telefone}
            onChange={(e) =>
              setTelefone(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) =>
              setIdade(
                e.target.value
              )
            }
          />

          <input
            placeholder="Nome do responsável"
            value={
              nomeResponsavel
            }
            onChange={(e) =>
              setNomeResponsavel(
                e.target.value
              )
            }
          />

          <input
            placeholder="CPF do responsável"
            value={
              cpfResponsavel
            }
            onChange={(e) =>
              setCpfResponsavel(
                e.target.value
              )
            }
          />

          <input
            placeholder="Telefone do responsável"
            value={
              telefoneResponsavel
            }
            onChange={(e) =>
              setTelefoneResponsavel(
                e.target.value
              )
            }
          />

        </div>

        <textarea
          className="obs-textarea"
          placeholder="Observações"
          value={obs}
          onChange={(e) =>
            setObs(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          className="cadastrar-btn"
        >

          Cadastrar Paciente

        </button>

      </form>

    </main>

  )

}

export default CadastroDentista