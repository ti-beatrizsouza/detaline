import { useState } from "react"

import logor from "../assets/logor.png"

import "../styles/agenda.css"

import AgendaGrid from "../components/AgendaGrid"
import AgendaTopBar from "../components/AgendaTopBar"
import AgendaModal from "../components/AgendaModal"
import NovoAgendamentoModal from "../components/NovoAgendamentoModal"
import SemanaNavigator from "../components/SemanaNavigator"

import useConsultas from "../hooks/useConsultas"
import usePacientes from "../hooks/usePacientes"
import useAgendaActions from "../hooks/useAgendaActions"

import {
  getDiasSemana,
  getHorarios,
  ganhoDoDia,
  ganhoDaSemana
} from "../utils/agendaUtils"

function Agenda({
  voltar,
  abrirPerfil,
  abrirCadastroDentista,
  abrirCadastroPaciente
}) {

  const dias = getDiasSemana()
  const horarios = getHorarios()

  const consultas = useConsultas()
  const pacientes = usePacientes()

  const [selecionada, setSelecionada] = useState(null)

  const [novoAgendamento, setNovoAgendamento] =
    useState(null)

  const [offsetSemana, setOffsetSemana] =
    useState(0)

  const [valorPago, setValorPago] =
    useState("")

  const [formaPagamento, setFormaPagamento] =
    useState("")

  const [obsEditando, setObsEditando] =
    useState("")

  const [buscaPaciente, setBuscaPaciente] =
    useState("")

  const [pacienteSelecionado, setPacienteSelecionado] =
    useState(null)

  const [dataConsulta, setDataConsulta] =
    useState("")

  const [pacienteTopo, setPacienteTopo] =
    useState("")

  const [diaTopo, setDiaTopo] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    )

  const [horaTopo, setHoraTopo] =
    useState("08:00")

  const [statusTopo, setStatusTopo] =
    useState("agendado")

  const actions = useAgendaActions({
    consultas,
    pacientes,
    selecionada,
    setSelecionada,
    valorPago,
    setValorPago,
    formaPagamento,
    setFormaPagamento,
    obsEditando,
    setObsEditando,
    novoAgendamento,
    setNovoAgendamento,
    buscaPaciente,
    setBuscaPaciente,
    pacienteSelecionado,
    setPacienteSelecionado,
    dataConsulta,
    setDataConsulta,
    pacienteTopo,
    setPacienteTopo,
    diaTopo,
    setDiaTopo,
    horaTopo,
    setHoraTopo,
    statusTopo,
    setStatusTopo
  })

  const pacienteModal =
    pacientes.find(
      p =>
        p.id ===
        selecionada?.pacienteId
    )

  return (

    <div className="agenda-container">

      <img
  src={logor}
  alt=""
  className="agenda-logo-fundo"
/>

      <AgendaTopBar
        voltar={voltar}
        pacientes={pacientes}
        pacienteTopo={pacienteTopo}
        setPacienteTopo={setPacienteTopo}
        diaTopo={diaTopo}
        setDiaTopo={setDiaTopo}
        horaTopo={horaTopo}
        setHoraTopo={setHoraTopo}
        statusTopo={statusTopo}
        setStatusTopo={setStatusTopo}
        horarios={horarios}
        agendarPeloTopo={actions.agendarPeloTopo}
        abrirCadastroDentista={
          abrirCadastroDentista
        }
      />

      <SemanaNavigator
        offsetSemana={offsetSemana}
        setOffsetSemana={setOffsetSemana}
      />

      <AgendaGrid
  dias={dias}
  horarios={horarios}
  consultas={consultas}
  pacientes={pacientes}
  offsetSemana={offsetSemana}

  ganhoDoDia={(data) =>
    ganhoDoDia(consultas, data)
  }

  ganhoDaSemana={() =>
    ganhoDaSemana(
      consultas,
      offsetSemana
    )
  }

  setSelecionada={setSelecionada}
  setObsEditando={setObsEditando}
  setNovoAgendamento={setNovoAgendamento}
/>

            {selecionada && (
        <AgendaModal
  selecionada={selecionada}
  setSelecionada={setSelecionada}

  pacienteModal={pacienteModal}
  pacientes={pacientes}
  abrirPerfil={abrirPerfil}

  valorPago={valorPago}
  setValorPago={setValorPago}

  formaPagamento={formaPagamento}
  setFormaPagamento={setFormaPagamento}

  obsEditando={obsEditando}
  setObsEditando={setObsEditando}

  mudarStatus={actions.mudarStatus}
  salvarObs={actions.salvarObs}
  salvarPagamento={actions.salvarPagamento}
  removerValor={actions.removerValor}
  remover={actions.remover}

  fechar={() =>
    setSelecionada(null)
  }
/>
      )}

      {novoAgendamento && (
        <NovoAgendamentoModal
  novoAgendamento={novoAgendamento}

  pacientes={pacientes}

  abrirCadastroPaciente={abrirCadastroPaciente}

  buscaPaciente={buscaPaciente}
  setBuscaPaciente={setBuscaPaciente}

  pacienteSelecionado={pacienteSelecionado}
  setPacienteSelecionado={setPacienteSelecionado}

  dataConsulta={dataConsulta}
  setDataConsulta={setDataConsulta}

  criarAgendamento={actions.criarAgendamento}

  fechar={() => {

    setNovoAgendamento(null)

    setBuscaPaciente("")

    setPacienteSelecionado(null)

    setDataConsulta("")

  }}
/>
      )}

    </div>

  )

}

export default Agenda