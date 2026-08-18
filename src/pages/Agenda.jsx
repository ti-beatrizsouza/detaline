import {
  useEffect,
  useState
} from "react"

import "../styles/agenda.css"

import AgendaGrid from "../components/AgendaGrid"
import AgendaTopBar from "../components/AgendaTopBar"
import AgendaModal from "../components/AgendaModal"
import NovoAgendamentoModal from "../components/NovoAgendamentoModal"

import useConsultas from "../hooks/useConsultas"
import usePacientes from "../hooks/usePacientes"
import useAgendaActions from "../hooks/useAgendaActions"

import {
  getDiasSemana,
  getHorarios,
  ganhoDoDia,
  ganhoDaSemana,
  getOffsetSemanaParaData
} from "../utils/agendaUtils"


function Agenda({
  voltar,
  abrirPerfil,
  abrirCadastroDentista,
  abrirCadastroPaciente,
  retornoAgendamento,
  limparRetornoAgendamento
}) {

  const dias = getDiasSemana()
  const horarios = getHorarios()

  const consultas = useConsultas()
  const pacientes = usePacientes()


  /* ===================================================== */
  /* ESTADOS                                               */
  /* ===================================================== */

  const [
    selecionada,
    setSelecionada
  ] = useState(null)


  const [
    novoAgendamento,
    setNovoAgendamento
  ] = useState(null)


  const [
    offsetSemana,
    setOffsetSemana
  ] = useState(0)


  const [
    dataPesquisa,
    setDataPesquisa
  ] = useState("")


  const [
    valorPago,
    setValorPago
  ] = useState("")


  const [
    formaPagamento,
    setFormaPagamento
  ] = useState("")


  const [
    pagamentoAberto,
    setPagamentoAberto
  ] = useState(false)


  const [
    obsEditando,
    setObsEditando
  ] = useState("")


  const [
    buscaPaciente,
    setBuscaPaciente
  ] = useState("")


  const [
    pacienteSelecionado,
    setPacienteSelecionado
  ] = useState(null)


  const [
    dataConsulta,
    setDataConsulta
  ] = useState("")


  const [
    pacienteTopo,
    setPacienteTopo
  ] = useState("")


  const [
    diaTopo,
    setDiaTopo
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  )


  const [
    horaTopo,
    setHoraTopo
  ] = useState("08:00")


  const [
    statusTopo,
    setStatusTopo
  ] = useState("agendado")


  /* ===================================================== */
  /* RETORNO DO CADASTRO                                   */
  /* ===================================================== */

  useEffect(() => {

    if (
      !retornoAgendamento
    ) {
      return
    }


    const agendamento =
      retornoAgendamento.novoAgendamento


    const paciente =
      retornoAgendamento.paciente


    if (
      !agendamento ||
      !paciente
    ) {
      return
    }


    /*
      Reabre exatamente o horário
      de onde o cadastro foi iniciado.
    */

    setNovoAgendamento(
      agendamento
    )


    /*
      Mantém a data original do slot.
    */

    setDataConsulta(
      agendamento.data || ""
    )


    /*
      Seleciona automaticamente
      o paciente recém-cadastrado.
    */

    setPacienteSelecionado(
      paciente
    )


    setBuscaPaciente(
      paciente.nome || ""
    )


    /*
      Garante que a semana exibida
      corresponde ao agendamento.
    */

    if (
      agendamento.data
    ) {

      const novoOffset =
        getOffsetSemanaParaData(
          agendamento.data
        )

      setOffsetSemana(
        novoOffset
      )

    }


    /*
      O retorno já foi consumido.
    */

    if (
      limparRetornoAgendamento
    ) {

      limparRetornoAgendamento()

    }

  }, [
    retornoAgendamento
  ])


  /* ===================================================== */
  /* IR PARA DATA                                          */
  /* ===================================================== */

  function irParaData(
    data
  ) {

    if (!data) {
      return
    }


    const novoOffset =
      getOffsetSemanaParaData(
        data
      )


    setOffsetSemana(
      novoOffset
    )

  }


  /* ===================================================== */
  /* AÇÕES                                                 */
  /* ===================================================== */

  const actions =
    useAgendaActions({

      consultas,
      pacientes,

      selecionada,
      setSelecionada,

      valorPago,
      setValorPago,

      formaPagamento,
      setFormaPagamento,

      obsEditando,

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


  /* ===================================================== */
  /* PACIENTE DO MODAL                                     */
  /* ===================================================== */

  const pacienteModal =
    pacientes.find(
      p =>
        p.id ===
        selecionada?.pacienteId
    )


  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <main className="agenda-container">


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <AgendaTopBar

        voltar={
          voltar
        }

        pacientes={
          pacientes
        }

        pacienteTopo={
          pacienteTopo
        }

        setPacienteTopo={
          setPacienteTopo
        }

        diaTopo={
          diaTopo
        }

        setDiaTopo={
          setDiaTopo
        }

        irParaData={
          irParaData
        }

        horaTopo={
          horaTopo
        }

        setHoraTopo={
          setHoraTopo
        }

        statusTopo={
          statusTopo
        }

        setStatusTopo={
          setStatusTopo
        }

        horarios={
          horarios
        }

        agendarPeloTopo={
          actions.agendarPeloTopo
        }

        abrirCadastroDentista={
          abrirCadastroDentista
        }

        offsetSemana={
          offsetSemana
        }

        setOffsetSemana={
          setOffsetSemana
        }

        dataPesquisa={
          dataPesquisa
        }

        setDataPesquisa={
          setDataPesquisa
        }

      />


      {/* ================================================= */}
      {/* GRID                                              */}
      {/* ================================================= */}

      <section className="agenda-area">

        <AgendaGrid

          dias={
            dias
          }

          horarios={
            horarios
          }

          consultas={
            consultas
          }

          pacientes={
            pacientes
          }

          offsetSemana={
            offsetSemana
          }

          ganhoDoDia={
            (data) =>
              ganhoDoDia(
                consultas,
                data
              )
          }

          ganhoDaSemana={
            () =>
              ganhoDaSemana(
                consultas,
                offsetSemana
              )
          }

          setSelecionada={
            setSelecionada
          }

          setObsEditando={
            setObsEditando
          }

          setNovoAgendamento={
            setNovoAgendamento
          }

        />

      </section>


      {/* ================================================= */}
      {/* MODAL DE CONSULTA                                 */}
      {/* ================================================= */}

      {
        selecionada && (

          <AgendaModal

            selecionada={
              selecionada
            }

            setSelecionada={
              setSelecionada
            }

            pacienteModal={
              pacienteModal
            }

            pacientes={
              pacientes
            }

            abrirPerfil={
              abrirPerfil
            }

            valorPago={
              valorPago
            }

            setValorPago={
              setValorPago
            }

            formaPagamento={
              formaPagamento
            }

            setFormaPagamento={
              setFormaPagamento
            }

            pagamentoAberto={
              pagamentoAberto
            }

            setPagamentoAberto={
              setPagamentoAberto
            }

            obsEditando={
              obsEditando
            }

            setObsEditando={
              setObsEditando
            }

            mudarStatus={
              actions.mudarStatus
            }

            salvarObs={
              actions.salvarObs
            }

            salvarPagamento={
              actions.salvarPagamento
            }

            removerValor={
              actions.removerValor
            }

            remover={
              actions.remover
            }

            fechar={() => {

              setSelecionada(
                null
              )

              setPagamentoAberto(
                false
              )

            }}

          />

        )
      }


      {/* ================================================= */}
      {/* NOVO AGENDAMENTO                                  */}
      {/* ================================================= */}

      {
        novoAgendamento && (

          <NovoAgendamentoModal

            novoAgendamento={
              novoAgendamento
            }

            pacientes={
              pacientes
            }

            abrirCadastroPaciente={
              abrirCadastroPaciente
            }

            buscaPaciente={
              buscaPaciente
            }

            setBuscaPaciente={
              setBuscaPaciente
            }

            pacienteSelecionado={
              pacienteSelecionado
            }

            setPacienteSelecionado={
              setPacienteSelecionado
            }

            dataConsulta={
              dataConsulta
            }

            setDataConsulta={
              setDataConsulta
            }

            criarAgendamento={
              actions.criarAgendamento
            }

            fechar={() => {

              setNovoAgendamento(
                null
              )

              setBuscaPaciente(
                ""
              )

              setPacienteSelecionado(
                null
              )

              setDataConsulta(
                ""
              )

            }}

          />

        )
      }


    </main>

  )

}


export default Agenda