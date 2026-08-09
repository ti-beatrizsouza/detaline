import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  updateDoc
} from "firebase/firestore"

import { db } from "../services/firebase"

export default function useAgendaActions({

  pacientes,

  selecionada,
  setSelecionada,

  valorPago,
  setValorPago,

  formaPagamento,
  setFormaPagamento,

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

}) {

  async function mudarStatus(status) {

    if (
      status === "pagou" &&
      !formaPagamento
    ) return

    await updateDoc(
      doc(db, "agenda", selecionada.id),
      {
        status,

        valorPago:
          status === "pagou"
            ? Number(valorPago || 0)
            : selecionada.valorPago || 0,

        formaPagamento:
          status === "pagou"
            ? formaPagamento
            : selecionada.formaPagamento || ""
      }
    )

    if (
      status === "pagou" &&
      valorPago &&
      selecionada.pacienteId
    ) {

      await updateDoc(
        doc(
          db,
          "pacientes",
          selecionada.pacienteId
        ),
        {
          totalPago: increment(
            Number(valorPago)
          )
        }
      )

    }

    setSelecionada({

      ...selecionada,

      status,

      valorPago:
        status === "pagou"
          ? Number(valorPago || 0)
          : selecionada.valorPago || 0,

      formaPagamento:
        status === "pagou"
          ? formaPagamento
          : selecionada.formaPagamento || ""

    })

    setValorPago("")

  }

  async function removerValor() {

    if (
      !selecionada?.pacienteId ||
      !selecionada?.valorPago
    ) return

    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {
        totalPago: increment(
          -Number(
            selecionada.valorPago
          )
        )
      }
    )

    await updateDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      ),
      {
        valorPago: 0,
        status: "confirmado",
        formaPagamento: ""
      }
    )

    setSelecionada({

      ...selecionada,

      valorPago: 0,
      status: "confirmado",
      formaPagamento: ""

    })

  }

  async function remover() {

    await deleteDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      )
    )

    setSelecionada(null)

  }

  async function criarAgendamento() {

    if (!pacienteSelecionado) {

      alert("Selecione um paciente")
      return

    }

    await addDoc(
      collection(db, "agenda"),
      {

        pacienteId:
          pacienteSelecionado.id,

        nome:
          pacienteSelecionado.nome,

        dia:
          novoAgendamento.dia,

        hora:
          novoAgendamento.hora,

        data:
          dataConsulta,

        status: "agendado",

        valorPago: 0

      }
    )

    await updateDoc(
      doc(
        db,
        "pacientes",
        pacienteSelecionado.id
      ),
      {
        proxConsulta: dataConsulta
      }
    )

    setNovoAgendamento(null)
    setBuscaPaciente("")
    setPacienteSelecionado(null)
    setDataConsulta("")

  }

  async function agendarPeloTopo() {

    if (!pacienteTopo || !diaTopo) {

      alert("Selecione paciente e data")
      return

    }

    const paciente =
      pacientes.find(
        p => p.id === pacienteTopo
      )

    if (!paciente) return

    const dataObj =
      new Date(diaTopo)

    const diasSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado"
    ]

    await addDoc(
      collection(db, "agenda"),
      {

        pacienteId: paciente.id,

        nome: paciente.nome,

        dia:
          diasSemana[
            dataObj.getDay()
          ],

        hora: horaTopo,

        data: diaTopo,

        status: statusTopo,

        valorPago: 0

      }
    )

    await updateDoc(
      doc(
        db,
        "pacientes",
        paciente.id
      ),
      {
        proxConsulta: diaTopo
      }
    )

    setPacienteTopo("")

    setDiaTopo(
      new Date()
        .toISOString()
        .split("T")[0]
    )

    setHoraTopo("07:00")
    setStatusTopo("agendado")

  }

  async function salvarObs() {

    const paciente =
      pacientes.find(
        p =>
          p.id ===
          selecionada.pacienteId
      )

    if (!paciente) return

    await updateDoc(
      doc(
        db,
        "pacientes",
        paciente.id
      ),
      {
        obs: obsEditando
      }
    )

    alert("Observação salva!")

  }

  async function salvarPagamento() {

    if (!formaPagamento) {

      alert(
        "Selecione a forma de pagamento"
      )

      return

    }

    if (!valorPago) {

      alert(
        "Informe o valor pago"
      )

      return

    }

    await updateDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      ),
      {
        status: "pagou",
        valorPago: Number(valorPago),
        formaPagamento
      }
    )

    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {
        totalPago: increment(
          Number(valorPago)
        )
      }
    )

    setSelecionada({

      ...selecionada,

      status: "pagou",

      valorPago:
        Number(valorPago),

      formaPagamento

    })

    setValorPago("")
    setFormaPagamento("")

  }

  return {

    mudarStatus,

    removerValor,

    remover,

    criarAgendamento,

    agendarPeloTopo,

    salvarObs,

    salvarPagamento

  }

}