// src/pages/Financeiro.jsx

import { useMemo, useState } from "react"

import "../styles/financeiro.css"

import logob from "../assets/logob.png"

import usePacientes from "../hooks/usePacientes"


function Financeiro({
  consultas = [],
  voltar
}) {

  const pacientes = usePacientes()

  const hoje = new Date()

  const [periodo, setPeriodo] =
    useState("mes")

  const [dataReferencia, setDataReferencia] =
    useState(
      hoje.toISOString().split("T")[0]
    )


  /* ===================================================== */
  /* PACIENTE                                              */
  /* ===================================================== */

  function encontrarPaciente(consulta) {

    return pacientes.find(
      (paciente) =>
        paciente.id === consulta.pacienteId
    )

  }


  /* ===================================================== */
  /* FORMATAÇÃO                                            */
  /* ===================================================== */

  function formatarValor(valor) {

    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    )

  }


  function formatarData(data) {

    if (!data) {
      return "-"
    }

    return new Date(
      data + "T00:00:00"
    ).toLocaleDateString("pt-BR")

  }


  function formatarDataInput(data) {

    if (!data) {
      return ""
    }

    return new Date(
      data + "T00:00:00"
    ).toLocaleDateString(
      "pt-BR"
    )

  }


  function formatarFormaPagamento(forma) {

    if (!forma) {
      return "-"
    }

    return (
      forma.charAt(0).toUpperCase() +
      forma.slice(1)
    )

  }


  /* ===================================================== */
  /* DATA DE REFERÊNCIA                                    */
  /* ===================================================== */

  const dataBase = useMemo(() => {

    return new Date(
      dataReferencia + "T00:00:00"
    )

  }, [dataReferencia])


  /* ===================================================== */
  /* INTERVALO DO PERÍODO                                  */
  /* ===================================================== */

  const intervaloPeriodo = useMemo(() => {

    let inicio
    let fim

    /* ------------------------------------------------- */
    /* DIA                                               */
    /* ------------------------------------------------- */

    if (periodo === "dia") {

      inicio = new Date(dataBase)

      fim = new Date(dataBase)

    }


    /* ------------------------------------------------- */
    /* SEMANA                                            */
    /* ------------------------------------------------- */

    if (periodo === "semana") {

      inicio = new Date(dataBase)

      const diaSemana =
        inicio.getDay()

      const diferenca =
        diaSemana === 0
          ? -6
          : 1 - diaSemana

      inicio.setDate(
        inicio.getDate() + diferenca
      )

      fim = new Date(inicio)

      fim.setDate(
        inicio.getDate() + 6
      )

    }


    /* ------------------------------------------------- */
    /* MÊS                                               */
    /* ------------------------------------------------- */

    if (periodo === "mes") {

      inicio = new Date(
        dataBase.getFullYear(),
        dataBase.getMonth(),
        1
      )

      fim = new Date(
        dataBase.getFullYear(),
        dataBase.getMonth() + 1,
        0
      )

    }


    /* ------------------------------------------------- */
    /* ANO                                               */
    /* ------------------------------------------------- */

    if (periodo === "ano") {

      inicio = new Date(
        dataBase.getFullYear(),
        0,
        1
      )

      fim = new Date(
        dataBase.getFullYear(),
        11,
        31
      )

    }


    return {
      inicio,
      fim
    }

  }, [
    periodo,
    dataBase
  ])


  /* ===================================================== */
  /* VERIFICAR SE ESTÁ NO PERÍODO                          */
  /* ===================================================== */

  function estaNoPeriodo(data) {

    if (!data) {
      return false
    }

    const dataConsulta =
      new Date(
        data + "T00:00:00"
      )

    const inicio =
      intervaloPeriodo.inicio

    const fim =
      intervaloPeriodo.fim

    return (
      dataConsulta >= inicio &&
      dataConsulta <= fim
    )

  }


  /* ===================================================== */
  /* CONSULTAS DO PERÍODO                                  */
  /* ===================================================== */

  const consultasDoPeriodo =
    useMemo(() => {

      return consultas.filter(
        (consulta) =>
          estaNoPeriodo(
            consulta.data
          )
      )

    }, [
      consultas,
      intervaloPeriodo
    ])


  /* ===================================================== */
  /* PAGAMENTOS REALIZADOS                                 */
  /* ===================================================== */

  const pagamentosRealizados =
    useMemo(() => {

      return consultasDoPeriodo.filter(
        (consulta) =>
          Number(
            consulta.valorPago || 0
          ) > 0
      )

    }, [
      consultasDoPeriodo
    ])


  /* ===================================================== */
  /* PAGAMENTOS PENDENTES                                  */
  /* ===================================================== */

  const pagamentosPendentes =
    useMemo(() => {

      return consultasDoPeriodo.filter(
        (consulta) => {

          const status =
            String(
              consulta.status || ""
            ).toLowerCase()

          return (
            status === "debito" ||
            status === "pendente" ||
            status === "pagamento pendente"
          )

        }
      )

    }, [
      consultasDoPeriodo
    ])


  /* ===================================================== */
  /* TOTAL                                                 */
  /* ===================================================== */

  const totalPeriodo =
    useMemo(() => {

      return pagamentosRealizados.reduce(
        (total, consulta) =>
          total +
          Number(
            consulta.valorPago || 0
          ),
        0
      )

    }, [
      pagamentosRealizados
    ])


  /* ===================================================== */
  /* QUANTIDADES                                           */
  /* ===================================================== */

  const quantidadePagamentos =
    pagamentosRealizados.length

  const quantidadePendentes =
    pagamentosPendentes.length


  /* ===================================================== */
  /* MÉDIA                                                 */
  /* ===================================================== */

  const mediaConsulta =
    quantidadePagamentos > 0
      ? totalPeriodo /
        quantidadePagamentos
      : 0


  /* ===================================================== */
  /* NOME DO PERÍODO                                       */
  /* ===================================================== */

  const nomePeriodo = {

    dia: "Hoje",

    semana: "Esta semana",

    mes: "Este mês",

    ano: "Este ano"

  }


  /* ===================================================== */
  /* TEXTO DO INTERVALO                                    */
  /* ===================================================== */

  function textoPeriodo() {

    const inicio =
      intervaloPeriodo.inicio

    const fim =
      intervaloPeriodo.fim

    if (periodo === "dia") {

      return formatarData(
        dataReferencia
      )

    }

    return (
      `${inicio.toLocaleDateString(
        "pt-BR"
      )} — ${fim.toLocaleDateString(
        "pt-BR"
      )}`
    )

  }


  /* ===================================================== */
  /* VOLTAR PARA HOJE                                      */
  /* ===================================================== */

  function irParaHoje() {

    const agora =
      new Date()

    setDataReferencia(
      agora
        .toISOString()
        .split("T")[0]
    )

  }


  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <main className="financeiro-container">


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <header className="financeiro-topo">

        <div className="financeiro-marca-area">

          <img
            src={logob}
            className="financeiro-logo"
            alt="Dentaline"
          />

          <div className="financeiro-titulo">

            <span>
              CONTROLE FINANCEIRO
            </span>

            <h1>
              Financeiro
            </h1>

            <p>
              Acompanhe os ganhos e pagamentos
              da clínica.
            </p>

          </div>

        </div>


        <button
          className="financeiro-voltar"
          onClick={voltar}
        >
          ← Voltar
        </button>

      </header>


      {/* ================================================= */}
      {/* FILTROS                                            */}
      {/* ================================================= */}

      <section className="financeiro-filtros">

        <div className="financeiro-periodos">

          <span className="financeiro-filtro-label">
            Período
          </span>

          <div className="financeiro-periodos-botoes">

            {[
              ["dia", "Dia"],
              ["semana", "Semana"],
              ["mes", "Mês"],
              ["ano", "Ano"]
            ].map(
              ([valor, texto]) => (

                <button
                  key={valor}
                  type="button"
                  className={
                    periodo === valor
                      ? "ativo"
                      : ""
                  }
                  onClick={() =>
                    setPeriodo(valor)
                  }
                >
                  {texto}
                </button>

              )
            )}

          </div>

        </div>


        <div className="financeiro-data-filtro">

          <label htmlFor="data-financeiro">
            Data de referência
          </label>

          <div className="financeiro-data-controles">

            <input
              id="data-financeiro"
              type="date"
              value={dataReferencia}
              onChange={(e) =>
                setDataReferencia(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={irParaHoje}
            >
              Hoje
            </button>

          </div>

        </div>


        <div className="financeiro-periodo-atual">

          <span>
            {nomePeriodo[periodo]}
          </span>

          <strong>
            {textoPeriodo()}
          </strong>

        </div>

      </section>


      {/* ================================================= */}
      {/* RESUMO                                            */}
      {/* ================================================= */}

      <section className="financeiro-resumo">


        <div className="financeiro-card financeiro-card-principal">

          <div className="financeiro-card-icone">
            💰
          </div>

          <div>

            <span>
              Receita do período
            </span>

            <strong>
              {formatarValor(
                totalPeriodo
              )}
            </strong>

          </div>

        </div>


        <div className="financeiro-card">

          <div className="financeiro-card-icone">
            🧾
          </div>

          <div>

            <span>
              Pagamentos realizados
            </span>

            <strong>
              {quantidadePagamentos}
            </strong>

          </div>

        </div>


        <div className="financeiro-card financeiro-card-pendente">

          <div className="financeiro-card-icone">
            ⏳
          </div>

          <div>

            <span>
              Pagamentos pendentes
            </span>

            <strong>
              {quantidadePendentes}
            </strong>

          </div>

        </div>


        <div className="financeiro-card">

          <div className="financeiro-card-icone">
            📊
          </div>

          <div>

            <span>
              Média por consulta
            </span>

            <strong>
              {formatarValor(
                mediaConsulta
              )}
            </strong>

          </div>

        </div>


      </section>


      {/* ================================================= */}
      {/* TABELAS                                           */}
      {/* ================================================= */}

      <section className="financeiro-tabelas">


        {/* ================================================= */}
        {/* PAGAMENTOS REALIZADOS — PRIMEIRO                 */}
        {/* ================================================= */}

        <div className="financeiro-tabela-container">

          <div className="financeiro-tabela-topo">

            <div>

              <div className="financeiro-titulo-tabela">

                <span className="financeiro-tabela-icone realizado">
                  ✓
                </span>

                <div>

                  <h2>
                    Pagamentos realizados
                  </h2>

                  <p>
                    Pagamentos registrados no período selecionado.
                  </p>

                </div>

              </div>

            </div>


            <div className="financeiro-total">

              <span>
                Total
              </span>

              <strong>
                {formatarValor(
                  totalPeriodo
                )}
              </strong>

            </div>

          </div>


          <div className="financeiro-tabela-scroll">

            <table className="financeiro-tabela">

              <thead>

                <tr>

                  <th>
                    Paciente
                  </th>

                  <th>
                    Tag
                  </th>

                  <th>
                    Responsável
                  </th>

                  <th>
                    CPF
                  </th>

                  <th>
                    Pagamento
                  </th>

                  <th>
                    Valor
                  </th>

                </tr>

              </thead>


              <tbody>

                {pagamentosRealizados.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="financeiro-vazio"
                    >
                      Nenhum pagamento registrado
                      neste período.
                    </td>

                  </tr>

                ) : (

                  pagamentosRealizados.map(
                    (consulta) => {

                      const paciente =
                        encontrarPaciente(
                          consulta
                        )

                      return (

                        <tr
                          key={consulta.id}
                        >

                          <td>

                            <strong>
                              {paciente?.nome ||
                                consulta.nome ||
                                "-"
                              }
                            </strong>

                          </td>


                          <td>

                            <span className="financeiro-tag">
                              {paciente?.tag || "—"}
                            </span>

                          </td>


                          <td>

                            {paciente?.responsavel ||
                              paciente?.nomeResponsavel ||
                              "-"
                            }

                          </td>


                          <td>

                            {paciente?.cpfResponsavel ||
                              paciente?.cpf ||
                              "-"
                            }

                          </td>


                          <td>

                            <span className="forma-pagamento">

                              {formatarFormaPagamento(
                                consulta.formaPagamento
                              )}

                            </span>

                            <small className="financeiro-data">

                              {formatarData(
                                consulta.data
                              )}

                              {" • "}

                              {consulta.hora || "-"}

                            </small>

                          </td>


                          <td className="valor-pago">

                            {formatarValor(
                              consulta.valorPago
                            )}

                          </td>

                        </tr>

                      )

                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ================================================= */}
        {/* PAGAMENTOS PENDENTES — SEGUNDO                   */}
        {/* ================================================= */}

        <div className="financeiro-tabela-container">

          <div className="financeiro-tabela-topo">

            <div>

              <div className="financeiro-titulo-tabela">

                <span className="financeiro-tabela-icone pendente">
                  !
                </span>

                <div>

                  <h2>
                    Pagamentos pendentes
                  </h2>

                  <p>
                    Pacientes que ainda possuem pagamento em aberto.
                  </p>

                </div>

              </div>

            </div>


            <span className="financeiro-contador-pendente">

              {quantidadePendentes}

            </span>

          </div>


          <div className="financeiro-tabela-scroll">

            <table className="financeiro-tabela">

              <thead>

                <tr>

                  <th>
                    Paciente
                  </th>

                  <th>
                    Tag
                  </th>

                  <th>
                    Responsável
                  </th>

                  <th>
                    CPF
                  </th>

                  <th>
                    Data
                  </th>

                </tr>

              </thead>


              <tbody>

                {pagamentosPendentes.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="financeiro-vazio"
                    >
                      Nenhum pagamento pendente
                      neste período.
                    </td>

                  </tr>

                ) : (

                  pagamentosPendentes.map(
                    (consulta) => {

                      const paciente =
                        encontrarPaciente(
                          consulta
                        )

                      return (

                        <tr
                          key={consulta.id}
                        >

                          <td>

                            <strong>
                              {paciente?.nome ||
                                consulta.nome ||
                                "-"
                              }
                            </strong>

                          </td>


                          <td>

                            <span className="financeiro-tag">
                              {paciente?.tag || "—"}
                            </span>

                          </td>


                          <td>

                            {paciente?.responsavel ||
                              paciente?.nomeResponsavel ||
                              "-"
                            }

                          </td>


                          <td>

                            {paciente?.cpfResponsavel ||
                              paciente?.cpf ||
                              "-"
                            }

                          </td>


                          <td>

                            {formatarData(
                              consulta.data
                            )}

                          </td>

                        </tr>

                      )

                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


      </section>


      {/* ================================================= */}
      {/* RODAPÉ                                            */}
      {/* ================================================= */}

      <footer className="financeiro-footer">

        <span>
          Dentaline
        </span>

        <span>
          Controle financeiro
        </span>

      </footer>


    </main>

  )

}

export default Financeiro