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
  /* ÚLTIMO PACIENTE VISTO                                 */
  /* ===================================================== */

  const [
    ultimoPacienteVisto,
    setUltimoPacienteVisto
  ] = useState(null)


  useEffect(() => {

    if (
      !selecionada?.pacienteId
    ) {
      return
    }


    const paciente =
      pacientes.find(
        p =>
          p.id ===
          selecionada.pacienteId
      )


    if (paciente) {

      setUltimoPacienteVisto(
        paciente
      )

    }

  }, [
    selecionada,
    pacientes
  ])


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
  /* AGENDAMENTO PELO TOPO                                 */
  /* ===================================================== */

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
  /* SINCRONIZAR CONSULTA ABERTA                           */
  /* ===================================================== */

  useEffect(() => {

    if (!selecionada) {

      setValorPago("")
      setFormaPagamento("")
      setParcelas("")
      setPagamentoAberto(false)

      return

    }


    if (
      selecionada.status ===
      "pagou"
    ) {

      setValorPago(

        selecionada.valorPago !==
          undefined &&
        selecionada.valorPago !==
          null

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

        selecionada.parcelas !==
          undefined &&
        selecionada.parcelas !==
          null

          ? String(
              selecionada.parcelas
            )

          : ""

      )


      setPagamentoAberto(
        true
      )

    } else {

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


    setUltimoPacienteVisto(
      paciente
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
  /* AÇÕES                                                 */
  /* ===================================================== */

  const actions =
    useAgendaActions({

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

      pacienteSelecionado,
      setPacienteSelecionado,

      novoAgendamento,
      setNovoAgendamento,

      setBuscaPaciente,

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

        abrirNovoAgendamento={() => {

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


          const dataHoje =
            `${ano}-${mes}-${dia}`


          setNovoAgendamento({

            dia:
              hoje.toLocaleDateString(
                "pt-BR",
                {
                  weekday: "long"
                }
              ),

            hora:
              "08:00",

            data:
              dataHoje

          })


          setDataConsulta(
            dataHoje
          )


          setBuscaPaciente("")
          setPacienteSelecionado(null)

          setValorPago("")
          setFormaPagamento("")
          setParcelas("")

        }}

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
            data =>
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

              setValorPago("")
              setFormaPagamento("")
              setParcelas("")

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

            ultimoPacienteVisto={
              ultimoPacienteVisto
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

              setValorPago("")
              setFormaPagamento("")
              setParcelas("")

            }}

          />

        )
      }

    </main>

  )

}


export default Agenda