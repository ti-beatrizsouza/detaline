import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where
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
  /* DATA LOCAL                                                */
  /* ========================================================= */

  function dataLocalHoje() {

    const hoje = new Date()

    const ano = hoje.getFullYear()

    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, "0")

    const dia = String(
      hoje.getDate()
    ).padStart(2, "0")

    return `${ano}-${mes}-${dia}`

  }


  /* ========================================================= */
  /* ADICIONAR PERÍODO À DATA                                  */
  /* ========================================================= */

  function adicionarPeriodo(
    data,
    periodo
  ) {

    if (!data) {
      return ""
    }

    const dataObj = new Date(
      `${data}T00:00:00`
    )

    if (
      Number.isNaN(
        dataObj.getTime()
      )
    ) {
      return ""
    }


    /*
      Mantém compatibilidade com os períodos antigos
      e também aceita:

      1-mes
      4-meses
      6-meses
      personalizado-10-dia
      personalizado-2-semana
      personalizado-3-mes
    */

    if (periodo === "1-semana") {

      dataObj.setDate(
        dataObj.getDate() + 7
      )

    } else if (periodo === "2-semanas") {

      dataObj.setDate(
        dataObj.getDate() + 14
      )

    } else {

      const partes = String(
        periodo || ""
      ).split("-")

      if (partes.length >= 2) {

        const quantidade = Number(
          partes[0] === "personalizado"
            ? partes[1]
            : partes[0]
        )

        let unidade =
          partes[0] === "personalizado"
            ? partes[2]
            : partes[1]

        if (
          unidade === "meses"
        ) {
          unidade = "mes"
        }

        if (
          Number.isFinite(quantidade) &&
          quantidade > 0
        ) {

          if (unidade === "dia") {

            dataObj.setDate(
              dataObj.getDate() + quantidade
            )

          } else if (unidade === "semana") {

            dataObj.setDate(
              dataObj.getDate() + quantidade * 7
            )

          } else if (unidade === "mes") {

            /*
              Evita problemas como:
              31/01 + 1 mês = 03/03

              Nesse caso queremos:
              31/01 + 1 mês = 28/02
            */

            const diaOriginal =
              dataObj.getDate()

            dataObj.setDate(1)

            dataObj.setMonth(
              dataObj.getMonth() + quantidade
            )

            const ultimoDiaMes =
              new Date(
                dataObj.getFullYear(),
                dataObj.getMonth() + 1,
                0
              ).getDate()

            dataObj.setDate(
              Math.min(
                diaOriginal,
                ultimoDiaMes
              )
            )

          }

        }

      }

    }


    const ano =
      dataObj.getFullYear()

    const mes =
      String(
        dataObj.getMonth() + 1
      ).padStart(
        2,
        "0"
      )

    const dia =
      String(
        dataObj.getDate()
      ).padStart(
        2,
        "0"
      )

    return `${ano}-${mes}-${dia}`

  }


  /* ========================================================= */
  /* MUDAR STATUS                                              */
  /* ========================================================= */

  async function mudarStatus(
    status
  ) {

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
        ? Number(
            valorPago || 0
          )
        : 0


    const pagamentoParcelado =
      status === "pagou" &&
      formaPagamento ===
        "credito_parcelado"


    const quantidadeParcelas =
      pagamentoParcelado
        ? Math.min(
            Math.max(
              Number(
                parcelas || 2
              ),
              2
            ),
            6
          )
        : 0


    const valorAnterior =
      Number(
        selecionada.valorPago || 0
      )


    await updateDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      ),
      {

        status,

        valorPago:
          status === "pagou"
            ? valor
            : 0,

        formaPagamento:
          status === "pagou"
            ? formaPagamento
            : "",

        parcelas:
          status === "pagou"
            ? quantidadeParcelas
            : 0

      }
    )


    /* =============================================== */
    /* ATUALIZA TOTAL PAGO DO PACIENTE                 */
    /* =============================================== */

    if (
      selecionada.pacienteId
    ) {

      const diferenca =
        valor -
        valorAnterior


      if (
        diferenca !== 0
      ) {

        await updateDoc(
          doc(
            db,
            "pacientes",
            selecionada.pacienteId
          ),
          {

            totalPago:
              increment(
                diferenca
              )

          }
        )

      }

    }


    setSelecionada({

      ...selecionada,

      status,

      valorPago:
        status === "pagou"
          ? valor
          : 0,

      formaPagamento:
        status === "pagou"
          ? formaPagamento
          : "",

      parcelas:
        status === "pagou"
          ? quantidadeParcelas
          : 0

    })


    if (
      status !== "pagou"
    ) {

      setValorPago("")
      setFormaPagamento("")
      setParcelas("")

    }

  }


  /* ========================================================= */
  /* REMOVER VALOR PAGO                                       */
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

        valorPago:
          0,

        status:
          "confirmado",

        formaPagamento:
          "",

        parcelas:
          0

      }
    )


    setSelecionada({

      ...selecionada,

      valorPago:
        0,

      status:
        "confirmado",

      formaPagamento:
        "",

      parcelas:
        0

    })


    setValorPago("")
    setFormaPagamento("")
    setParcelas("")

  }


  /* ========================================================= */
  /* REMOVER AGENDAMENTO                                      */
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


    setSelecionada(
      null
    )

  }


  /* ========================================================= */
  /* EXCLUIR PRÓXIMOS AGENDAMENTOS AUTOMÁTICOS                */
  /* ========================================================= */

  async function removerAgendamentosFuturos() {

    if (
      !selecionada?.pacienteId
    ) {

      return 0

    }


    const agendaRef =
      collection(
        db,
        "agenda"
      )


    /*
      Buscamos somente pelo paciente.

      Isso evita precisar de um índice composto
      no Firestore.

      A filtragem da série e da data é feita
      aqui no JavaScript.
    */

    const consultaAgenda =
      query(
        agendaRef,
        where(
          "pacienteId",
          "==",
          selecionada.pacienteId
        )
      )


    const snapshot =
      await getDocs(
        consultaAgenda
      )


    const futuras = []


    snapshot.forEach(
      item => {

        const consulta =
          item.data()


        const mesmaSerie =
          selecionada.serieReagendamentoId
            ? consulta.serieReagendamentoId ===
              selecionada.serieReagendamentoId
            : true


        const ehAutomatica =
          consulta.reagendamentoAutomatico === true


        const ehFutura =
          consulta.data &&
          selecionada.data &&
          consulta.data >
            selecionada.data


        if (
          ehAutomatica &&
          mesmaSerie &&
          ehFutura
        ) {

          futuras.push(
            item
          )

        }

      }
    )


    await Promise.all(
      futuras.map(
        item =>
          deleteDoc(
            item.ref
          )
      )
    )


    /*
      Depois de cortar a sequência,
      a próxima consulta passa a ser
      a consulta selecionada.
    */

    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {

        proxConsulta:
          selecionada.data ||
          dataLocalHoje()

      }
    )


    return futuras.length

  }


  /* ========================================================= */
  /* CRIAR AGENDAMENTO                                        */
  /* ========================================================= */

  async function criarAgendamento(

    periodoReagendamento = "nenhum",

    status = "agendado",

    dadosPagamento = {}

  ) {

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


    const horaFinal =
      novoAgendamento?.hora ||
      "08:00"


    const paciente =
      pacienteSelecionado


    const dataObj =
      new Date(
        `${dataFinal}T00:00:00`
      )


    if (
      Number.isNaN(
        dataObj.getTime()
      )
    ) {

      alert(
        "Data inválida"
      )

      return

    }


    const diasSemana = [

      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado"

    ]


    /* ===================================================== */
    /* PAGAMENTO                                             */
    /* ===================================================== */

    let valorPagamento =
      0


    let formaPagamentoAtual =
      ""


    let quantidadeParcelas =
      0


    if (
      status === "pagou"
    ) {

      formaPagamentoAtual =
        dadosPagamento.formaPagamento ||
        ""


      valorPagamento =
        Number(
          dadosPagamento.valorPago ||
          0
        )


      if (
        !formaPagamentoAtual
      ) {

        alert(
          "Selecione a forma de pagamento"
        )

        return

      }


      if (
        !Number.isFinite(
          valorPagamento
        ) ||
        valorPagamento <= 0
      ) {

        alert(
          "Informe um valor pago válido"
        )

        return

      }


      if (
        formaPagamentoAtual ===
        "credito_parcelado"
      ) {

        quantidadeParcelas =
          Math.min(
            Math.max(
              Number(
                dadosPagamento.parcelas || 2
              ),
              2
            ),
            6
          )

      }

    }


    /* ===================================================== */
    /* CONFIGURAÇÃO DO REAGENDAMENTO                         */
    /* ===================================================== */

    const reagendamentoPersonalizado =
      dadosPagamento.reagendamentoPersonalizado ||
      ""


    const repetirAte =
      dadosPagamento.repetirAte ||
      ""


    const periodoFinal =
      reagendamentoPersonalizado ||
      periodoReagendamento


    const temReagendamento =
      periodoFinal &&
      periodoFinal !== "nenhum"


    /*
      Se houver repetição automática,
      a data final é obrigatória.
    */

    if (
      temReagendamento &&
      !repetirAte
    ) {

      alert(
        "Informe até qual data o reagendamento deve ser criado."
      )

      return

    }


    if (
      temReagendamento &&
      repetirAte <= dataFinal
    ) {

      alert(
        "A data de término deve ser posterior à data da consulta."
      )

      return

    }


    /*
      Testa se o período realmente consegue
      gerar uma próxima consulta.
    */

    let primeiraDataProxima = ""


    if (
      temReagendamento
    ) {

      primeiraDataProxima =
        adicionarPeriodo(
          dataFinal,
          periodoFinal
        )


      if (
        !primeiraDataProxima ||
        primeiraDataProxima <= dataFinal
      ) {

        alert(
          "Não foi possível calcular a próxima consulta."
        )

        return

      }


      if (
        primeiraDataProxima > repetirAte
      ) {

        alert(
          "A data final não permite criar nenhuma próxima consulta com o período escolhido."
        )

        return

      }

    }


    /* ===================================================== */
    /* SÉRIE DE REAGENDAMENTO                                */
    /* ===================================================== */

    const serieReagendamentoId =
      temReagendamento
        ? `${paciente.id}-${Date.now()}`
        : ""


    /* ===================================================== */
    /* CRIAR CONSULTA ATUAL                                  */
    /* ===================================================== */

    const consultaAtualRef =
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
            horaFinal,

          data:
            dataFinal,

          status,

          valorPago:
            valorPagamento,

          formaPagamento:
            formaPagamentoAtual,

          parcelas:
            quantidadeParcelas,

          ...(temReagendamento
            ? {
                serieReagendamentoId,
                reagendamentoAte:
                  repetirAte,
                periodoReagendamento:
                  periodoFinal
              }
            : {})

        }
      )


    /* ===================================================== */
    /* TOTAL PAGO                                            */
    /* ===================================================== */

    if (
      status === "pagou" &&
      valorPagamento > 0
    ) {

      await updateDoc(
        doc(
          db,
          "pacientes",
          paciente.id
        ),
        {

          totalPago:
            increment(
              valorPagamento
            )

        }
      )

    }


    /* ===================================================== */
    /* REAGENDAMENTO AUTOMÁTICO EM SEQUÊNCIA                 */
    /* ===================================================== */

    let dataProxima =
      ""


    if (
      temReagendamento
    ) {

      let dataAnterior =
        dataFinal


      let contador =
        0


      /*
        Limite de segurança para evitar
        loop infinito caso exista algum
        período inválido.
      */

      while (
        contador < 1000
      ) {

        const proximaData =
          adicionarPeriodo(
            dataAnterior,
            periodoFinal
          )


        if (
          !proximaData ||
          proximaData <= dataAnterior
        ) {

          break

        }


        if (
          proximaData >
          repetirAte
        ) {

          break

        }


        const proximaDataObj =
          new Date(
            `${proximaData}T00:00:00`
          )


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
                proximaDataObj.getDay()
              ],

            hora:
              horaFinal,

            data:
              proximaData,

            status:
              "agendado",

            valorPago:
              0,

            formaPagamento:
              "",

            parcelas:
              0,

            reagendamentoAutomatico:
              true,

            serieReagendamentoId,

            consultaAnteriorData:
              dataAnterior,

            reagendamentoAte:
              repetirAte,

            periodoReagendamento:
              periodoFinal

          }
        )


        if (
          !dataProxima
        ) {

          dataProxima =
            proximaData

        }


        dataAnterior =
          proximaData


        contador++

      }

    }


    /* ===================================================== */
    /* ATUALIZAR METADADOS DA CONSULTA ATUAL                */
    /* ===================================================== */

    if (
      temReagendamento
    ) {

      await updateDoc(
        consultaAtualRef,
        {

          serieReagendamentoId,

          reagendamentoAte:
            repetirAte,

          periodoReagendamento:
            periodoFinal

        }
      )

    }


    /* ===================================================== */
    /* PRÓXIMA CONSULTA DO PACIENTE                          */
    /* ===================================================== */

    await updateDoc(
      doc(
        db,
        "pacientes",
        paciente.id
      ),
      {

        proxConsulta:
          dataProxima ||
          dataFinal

      }
    )


    /* ===================================================== */
    /* LIMPAR                                               */
    /* ===================================================== */

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

  }


  /* ========================================================= */
  /* AGENDAR PELO TOPO                                        */
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
      new Date(
        `${diaTopo}T00:00:00`
      )


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

        valorPago:
          0,

        formaPagamento:
          "",

        parcelas:
          0

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


    setPacienteTopo(
      ""
    )

    setDiaTopo(
      dataLocalHoje()
    )

    setHoraTopo(
      "07:00"
    )

    setStatusTopo(
      "agendado"
    )

  }


  /* ========================================================= */
  /* SALVAR OBSERVAÇÃO                                        */
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
      Number(
        valorPago
      )


    if (
      !Number.isFinite(
        valor
      ) ||
      valor <= 0
    ) {

      alert(
        "Informe um valor válido"
      )

      return

    }


    let quantidadeParcelas =
      0


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


    const valorAnterior =
      Number(
        selecionada.valorPago || 0
      )


    const diferenca =
      valor -
      valorAnterior


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


    if (
      selecionada.pacienteId &&
      diferenca !== 0
    ) {

      await updateDoc(
        doc(
          db,
          "pacientes",
          selecionada.pacienteId
        ),
        {

          totalPago:
            increment(
              diferenca
            )

        }
      )

    }


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


    alert(
      `Pagamento de R$ ${valor
        .toFixed(2)
        .replace(".", ",")} confirmado.`
    )


    setValorPago(
      String(
        valor
      )
    )


    setFormaPagamento(
      formaPagamento
    )


    setParcelas(
      quantidadeParcelas
    )

  }


  /* ========================================================= */
  /* RETORNO                                                   */
  /* ========================================================= */

  return {

    mudarStatus,

    removerValor,

    remover,

    removerAgendamentosFuturos,

    criarAgendamento,

    agendarPeloTopo,

    salvarObs,

    salvarPagamento

  }

}