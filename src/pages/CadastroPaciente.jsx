import { useState } from "react"

import { db } from "../services/firebase"

import {
  collection,
  addDoc
} from "firebase/firestore"

import "../styles/cadastro.css"

function CadastroPaciente() {

  const [nome, setNome] = useState("")
  const [idade, setIdade] = useState("")
  const [tel, setTel] = useState("")
  const [obs, setObs] = useState("")
  const [proxConsulta, setProxConsulta] = useState("")

  const [responsavel, setResponsavel] = useState("")
  const [telResponsavel, setTelResponsavel] = useState("")
  const [cpfResponsavel, setCpfResponsavel] = useState("")

  async function cadastrarPaciente(e) {

    e.preventDefault()

    try {

      await addDoc(collection(db, "pacientes"), {

        nome,
        idade: Number(idade),

        tel,

        obs,

        proxConsulta,

        responsavel,

        telResponsavel,

        cpfResponsavel,

        timeline: [],

        tipo: "paciente"

      })

      alert("Paciente cadastrado!")

      setNome("")
      setIdade("")
      setTel("")
      setObs("")
      setProxConsulta("")
      setResponsavel("")
      setTelResponsavel("")
      setCpfResponsavel("")

    } catch (error) {

      console.log(error)

      alert("Erro ao cadastrar")

    }

  }

  return (

    <main className="cadastro-container">

      <form
        className="cadastro-form"
        onSubmit={cadastrarPaciente}
      >

        <h1>Cadastro de Paciente</h1>

        <div className="input-group">

          <label>Nome do paciente</label>

          <input
            type="text"
            placeholder="Digite o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

        </div>

        <div className="input-group">

          <label>Idade</label>

          <input
            type="number"
            placeholder="Digite a idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />

        </div>

        <div className="input-group">

          <label>Telefone do paciente (opcional)</label>

          <input
            type="text"
            placeholder="(92) 99999-9999"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />

        </div>

        <div className="input-group">

          <label>Nome do responsável</label>

          <input
            type="text"
            placeholder="Digite o nome do responsável"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
          />

        </div>

        <div className="input-group">

          <label>Telefone do responsável</label>

          <input
            type="text"
            placeholder="(92) 99999-9999"
            value={telResponsavel}
            onChange={(e) => setTelResponsavel(e.target.value)}
            required
          />

        </div>

        <div className="input-group">

          <label>CPF do responsável</label>

          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpfResponsavel}
            onChange={(e) => setCpfResponsavel(e.target.value)}
            required
          />

        </div>

        <div className="input-group">

          <label>Próxima consulta</label>

          <input
            type="date"
            value={proxConsulta}
            onChange={(e) => setProxConsulta(e.target.value)}
          />

        </div>

        <div className="input-group">

          <label>Observações</label>

          <textarea
            placeholder="Digite observações"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />

        </div>

        <button type="submit">
          Cadastrar paciente
        </button>

      </form>

    </main>

  )

}

export default CadastroPaciente