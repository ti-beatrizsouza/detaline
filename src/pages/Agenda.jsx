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


  const dias =
    getDiasSemana()


  const horarios =
    getHorarios()


  const consultas =
    useConsultas()


  const pacientes =
    usePacientes()


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


  /* ===================================================== */
  /* PAGAMENTO                                             */
  /* ===================================================== */

  const [
    valorPago,
    setValorPago
  ] = useState("")


  const [
    formaPagamento,
    setFormaPagamento
  ] = useState("")


  const [
    parcelas,
    setParcelas
  ] = useState("")
  

  const [
    pagamentoAberto,
    setPagamentoAberto
  ] = useState(false)


  /* ===================================================== */
  /* OBSERVAÇÕES                                           */
  /* ===================================================== */

  const [
    obsEditando,
    setObsEditando
  ] = useState("")


  /* ===================================================== */
  /* NOVO AGENDAMENTO                                      */
  /* ===================================================== */

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


  /* ===================================================== */
  /* SINCRONIZAR DADOS DA CONSULTA ABERTA                 */
  /* ===================================================== */

  useEffect(() => {

    if (!selecionada) {

      setValorPago("")
      setFormaPagamento("")
      setParcelas("")
      setPagamentoAberto(false)

      return

    }


    /*
     * Quando uma consulta é aberta,
     * recuperamos os dados que já estão
     * salvos nela.
     */

    if (
      selecionada.status === "pagou"
    ) {

      setValorPago(
        selecionada.valorPago !== undefined &&
        selecionada.valorPago !== null
          ? String(
              selecionada.valorPago
            )
          : ""
      )


      setFormaPagamento(
        selecionada.formaPagamento ||
        ""
      )


      setParcelas(
        selecionada.parcelas
          ? String(
              selecionada.parcelas
            )
          : ""
      )


      /*
       * Se já foi paga, a aba de pagamento
       * abre automaticamente.
       */

      setPagamentoAberto(true)

    }
    else {

      setValorPago("")
      setFormaPagamento("")
      setParcelas("")
      setPagamentoAberto(false)

    }

  }, [
    selecionada
  ])


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


    setNovoAgendamento(
      agendamento
    )


    setDataConsulta(
      agendamento.data || ""
    )


    setPacienteSelecionado(
      paciente
    )


    setBuscaPaciente(
      paciente.nome || ""
    )


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
  /* DATA LOCAL                                            */
  /* ===================================================== */

  function obterDataHoje() {

    const hoje =
      new Date()


    const ano =
      hoje.getFullYear()


    const mes =
      String(
        hoje.getMonth() + 1
      ).padStart(
        2,
        "0"
      )


    const dia =
      String(
        hoje.getDate()
      ).padStart(
        2,
        "0"
      )


    return (
      `${ano}-${mes}-${dia}`
    )

  }


  /* ===================================================== */
  /* NOVO AGENDAMENTO                                      */
  /* ===================================================== */

  function abrirNovoAgendamento() {

    const dataHoje =
      obterDataHoje()


    const hoje =
      new Date()


    const diaSemana =
      hoje.getDay()


    const nomesDias = [

      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado"

    ]


    setNovoAgendamento({

      dia:
        nomesDias[
          diaSemana
        ],

      hora:
        "08:00",

      data:
        dataHoje

    })


    setDataConsulta(
      dataHoje
    )


    setBuscaPaciente(
      ""
    )


    setPacienteSelecionado(
      null
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

      parcelas,
      setParcelas,

      obsEditando,

      novoAgendamento,
      setNovoAgendamento,

      buscaPaciente,
      setBuscaPaciente,

      pacienteSelecionado,
      setPacienteSelecionado,

      dataConsulta,
      setDataConsulta

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

        abrirNovoAgendamento={
          abrirNovoAgendamento
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

        irParaData={
          irParaData
        }

      />


      {/* ================================================= */}
      {/* AGENDA                                             */}
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

            parcelas={
              parcelas
            }

            setParcelas={
              setParcelas
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

              setValorPago(
                ""
              )

              setFormaPagamento(
                ""
              )

              setParcelas(
                ""
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

            setNovoAgendamento={
              setNovoAgendamento
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