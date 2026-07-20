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

  const [cpf, setCpf] =
    useState("")

  const [nascimento, setNascimento] =
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

    function formatarTelefone(valor) {

  valor = valor.replace(/\D/g, "")

  if (valor.startsWith("55")) {
    valor = valor.substring(2)
  }

  valor = valor.substring(0, 11)

  if (valor.length <= 2)
    return "+55 (" + valor

  if (valor.length <= 7)
    return `+55 (${valor.slice(0,2)}) ${valor.slice(2)}`

  return `+55 (${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`
}

function formatarCPF(valor) {

  valor = valor.replace(/\D/g,"")

  valor = valor.substring(0,11)

  valor = valor.replace(
    /(\d{3})(\d)/,
    "$1.$2"
  )

  valor = valor.replace(
    /(\d{3})(\d)/,
    "$1.$2"
  )

  valor = valor.replace(
    /(\d{3})(\d{1,2})$/,
    "$1-$2"
  )

  return valor
}

function calcularIdade(data){

  if(!data) return 0

  const hoje = new Date()

  const nasc = new Date(data)

  let idade = hoje.getFullYear() - nasc.getFullYear()

  const mes = hoje.getMonth() - nasc.getMonth()

  if(

    mes < 0 ||

    (

      mes === 0 &&

      hoje.getDate() < nasc.getDate()

    )

  ){

    idade--

  }

  return idade

}

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

          cpf,

nascimento,

idade:
calcularIdade(nascimento),

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
            onChange={(e)=>
setTelefone(
formatarTelefone(
e.target.value
)
)}
          />

          <input
type="date"
value={nascimento}
onChange={(e)=>
setNascimento(
e.target.value
)}
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
            onChange={(e)=>
setCpfResponsavel(
formatarCPF(
e.target.value
)
)
}
          />

          <input
            placeholder="Telefone do responsável"
            value={
              telefoneResponsavel
            }
            onChange={(e)=>

setTelefoneResponsavel(

formatarTelefone(

e.target.value

)

)

}
          />

          <input

placeholder="CPF"

value={cpf}

onChange={(e)=>
setCpf(
formatarCPF(
e.target.value
))
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