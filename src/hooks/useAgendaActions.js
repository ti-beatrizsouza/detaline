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
}) {


  /* ========================================================= */
  /* MUDAR STATUS                                               */
  /* ========================================================= */

  async function mudarStatus(status) {

    if (!selecionada) {
      return
    }


    if (
      status === "pagou" &&
      !formaPagamento
    ) {

      alert(
        "Selecione a forma de pagamento"
      )

      return
    }


    const valor =
      status === "pagou"
        ? Number(valorPago || 0)
        : Number(
            selecionada.valorPago || 0
          )


    const pagamentoParcelado =
      status === "pagou" &&
      formaPagamento ===
        "credito_parcelado"


    const quantidadeParcelas =
      pagamentoParcelado
        ? Math.min(
            Math.max(
              Number(parcelas || 2),
              2
            ),
            6
          )
        : 0


    await updateDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      ),
      {

        status,

        valorPago:
          valor,

        formaPagamento:
          status === "pagou"
            ? formaPagamento
            : selecionada.formaPagamento || "",

        parcelas:
          status === "pagou"
            ? quantidadeParcelas
            : selecionada.parcelas || 0
      }
    )


    if (
      status === "pagou" &&
      valor > 0 &&
      selecionada.pacienteId
    ) {

      await updateDoc(
        doc(
          db,
          "pacientes",
          selecionada.pacienteId
        ),
        {
          totalPago:
            increment(valor)
        }
      )

    }


    setSelecionada({

      ...selecionada,

      status,

      valorPago:
        valor,

      formaPagamento:
        status === "pagou"
          ? formaPagamento
          : selecionada.formaPagamento || "",

      parcelas:
        status === "pagou"
          ? quantidadeParcelas
          : selecionada.parcelas || 0

    })


    if (setValorPago) {
      setValorPago("")
    }

    if (setFormaPagamento) {
      setFormaPagamento("")
    }

    if (setParcelas) {
      setParcelas(2)
    }

  }


  /* ========================================================= */
  /* REMOVER VALOR PAGO                                        */
  /* ========================================================= */

  async function removerValor() {

    if (
      !selecionada?.pacienteId ||
      !selecionada?.valorPago
    ) {

      return

    }


    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {
        totalPago:
          increment(
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

        status:
          "confirmado",

        formaPagamento: "",

        parcelas: 0

      }
    )


    setSelecionada({

      ...selecionada,

      valorPago: 0,

      status:
        "confirmado",

      formaPagamento: "",

      parcelas: 0

    })


    if (setValorPago) {
      setValorPago("")
    }

    if (setFormaPagamento) {
      setFormaPagamento("")
    }

    if (setParcelas) {
      setParcelas(2)
    }

  }


  /* ========================================================= */
  /* REMOVER AGENDAMENTO                                       */
  /* ========================================================= */

  async function remover() {

    if (!selecionada) {
      return
    }


    await deleteDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      )
    )


    setSelecionada(null)

  }


  /* ========================================================= */
  /* CRIAR AGENDAMENTO                                         */
  /* ========================================================= */

  async function criarAgendamento() {

    if (!pacienteSelecionado) {

      alert(
        "Selecione um paciente"
      )

      return

    }


    const dataFinal =
      dataConsulta ||
      novoAgendamento?.data ||
      ""


    if (!dataFinal) {

      alert(
        "Selecione uma data"
      )

      return

    }


    await addDoc(
      collection(
        db,
        "agenda"
      ),
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
          dataFinal,

        status:
          "agendado",

        valorPago: 0,

        formaPagamento: "",

        parcelas: 0

      }
    )


    await updateDoc(
      doc(
        db,
        "pacientes",
        pacienteSelecionado.id
      ),
      {
        proxConsulta:
          dataFinal
      }
    )


    setNovoAgendamento(null)

    setBuscaPaciente("")

    setPacienteSelecionado(null)

    setDataConsulta("")

  }


  /* ========================================================= */
  /* AGENDAR PELO TOPO                                         */
  /* ========================================================= */

  async function agendarPeloTopo() {

    if (
      !pacienteTopo ||
      !diaTopo
    ) {

      alert(
        "Selecione paciente e data"
      )

      return

    }


    const paciente =
      pacientes.find(
        p =>
          p.id ===
          pacienteTopo
      )


    if (!paciente) {
      return
    }


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
      collection(
        db,
        "agenda"
      ),
      {

        pacienteId:
          paciente.id,

        nome:
          paciente.nome,

        dia:
          diasSemana[
            dataObj.getDay()
          ],

        hora:
          horaTopo,

        data:
          diaTopo,

        status:
          statusTopo,

        valorPago: 0,

        formaPagamento: "",

        parcelas: 0

      }
    )


    await updateDoc(
      doc(
        db,
        "pacientes",
        paciente.id
      ),
      {
        proxConsulta:
          diaTopo
      }
    )


    setPacienteTopo("")

    setDiaTopo(
      new Date()
        .toISOString()
        .split("T")[0]
    )

    setHoraTopo(
      "07:00"
    )

    setStatusTopo(
      "agendado"
    )

  }


  /* ========================================================= */
  /* SALVAR OBSERVAÇÃO                                         */
  /* ========================================================= */

  async function salvarObs() {

    if (!selecionada) {
      return
    }


    const paciente =
      pacientes.find(
        p =>
          p.id ===
          selecionada.pacienteId
      )


    if (!paciente) {
      return
    }


    await updateDoc(
      doc(
        db,
        "pacientes",
        paciente.id
      ),
      {
        obs:
          obsEditando
      }
    )


    alert(
      "Observação salva!"
    )

  }


  /* ========================================================= */
  /* SALVAR PAGAMENTO                                          */
  /* ========================================================= */

  async function salvarPagamento() {

    if (!selecionada) {
      return
    }


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


    const valor =
      Number(valorPago)


    let quantidadeParcelas = 0


    if (
      formaPagamento ===
      "credito_parcelado"
    ) {

      quantidadeParcelas =
        Math.min(
          Math.max(
            Number(
              parcelas || 2
            ),
            2
          ),
          6
        )

    }


    await updateDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      ),
      {

        status:
          "pagou",

        valorPago:
          valor,

        formaPagamento,

        parcelas:
          quantidadeParcelas

      }
    )


    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {

        totalPago:
          increment(valor)

      }
    )


    setSelecionada({

      ...selecionada,

      status:
        "pagou",

      valorPago:
        valor,

      formaPagamento,

      parcelas:
        quantidadeParcelas

    })


    if (setValorPago) {
      setValorPago("")
    }


    if (setFormaPagamento) {
      setFormaPagamento("")
    }


    if (setParcelas) {
      setParcelas(2)
    }

  }


  /* ========================================================= */
  /* RETORNO                                                    */
  /* ========================================================= */

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