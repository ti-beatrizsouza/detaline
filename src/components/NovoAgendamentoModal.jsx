import {
  useEffect,
  useState
} from "react"


function NovoAgendamentoModal({

  novoAgendamento,
  setNovoAgendamento,

  pacientes,

  buscaPaciente,
  setBuscaPaciente,

  pacienteSelecionado,
  setPacienteSelecionado,

  dataConsulta,
  setDataConsulta,

  criarAgendamento,
  fechar,

  abrirCadastroPaciente,

  ultimoPacienteVisto,

  valorPago,
  setValorPago,

  formaPagamento,
  setFormaPagamento,

  parcelas,
  setParcelas

}) {


  /* ===================================================== */
  /* FILTROS                                               */
  /* ===================================================== */

  const [
    filtroTag,
    setFiltroTag
  ] = useState("todas")


  const [
    ordemPacientes,
    setOrdemPacientes
  ] = useState("nome-az")


  /* ===================================================== */
  /* STATUS                                                */
  /* ===================================================== */

  const [
    statusConsulta,
    setStatusConsulta
  ] = useState("agendado")


  /* ===================================================== */
  /* REAGENDAMENTO                                         */
  /* ===================================================== */

  const [
    reagendamento,
    setReagendamento
  ] = useState("nenhum")


  const [
    personalizadoValor,
    setPersonalizadoValor
  ] = useState("")


  const [
    personalizadoTipo,
    setPersonalizadoTipo
  ] = useState("mes")


  const [
    repetirAte,
    setRepetirAte
  ] = useState("")


  /* ===================================================== */
  /* ABERTURA DO MODAL                                     */
  /* ===================================================== */

  useEffect(() => {

    if (!novoAgendamento) {
      return
    }


    setStatusConsulta(
      "agendado"
    )


    setReagendamento(
      "nenhum"
    )


    setPersonalizadoValor(
      ""
    )


    setPersonalizadoTipo(
      "mes"
    )


    setRepetirAte("")


    setValorPago("")
    setFormaPagamento("")
    setParcelas("")

  }, [
    novoAgendamento
  ])


  /* ===================================================== */
  /* SUGESTÃO PELO TIPO DE PACIENTE                       */
  /* ===================================================== */

  useEffect(() => {

    if (
      !pacienteSelecionado
    ) {
      return
    }


    const tipo =
      String(
        pacienteSelecionado.tipoPaciente ||
        ""
      )
        .trim()
        .toLowerCase()


    /*
     * Pacientes de Ortodontia
     * recebem 1 mês como sugestão.
     *
     * A doutora pode alterar
     * manualmente depois.
     */

    if (
      tipo === "ortodontia"
    ) {

      setReagendamento(
        "1-mes"
      )

    }

  }, [
    pacienteSelecionado
  ])


  if (!novoAgendamento) {
    return null
  }


  /* ===================================================== */
  /* HORÁRIOS                                              */
  /* ===================================================== */

  const horarios = []


  for (
    let h = 7;
    h <= 20;
    h++
  ) {

    horarios.push(
      `${String(h).padStart(2, "0")}:00`
    )


    if (
      h !== 20
    ) {

      horarios.push(
        `${String(h).padStart(2, "0")}:30`
      )

    }

  }


  /* ===================================================== */
  /* TAG                                                   */
  /* ===================================================== */

  function obterTag(
    paciente
  ) {

    const tag =
      paciente?.tag ??
      paciente?.tags ??
      ""


    if (
      Array.isArray(tag)
    ) {

      return (
        tag[0] ??
        ""
      )

    }


    return tag

  }


  function formatarTag(
    paciente
  ) {

    const tag =
      obterTag(
        paciente
      )


    if (
      tag === null ||
      tag === undefined ||
      String(tag).trim() === ""
    ) {

      return ""

    }


    return (
      `#${String(tag).replace(/^#/, "")}`
    )

  }


  function valorTag(
    paciente
  ) {

    const tag =
      obterTag(
        paciente
      )


    if (
      tag === null ||
      tag === undefined ||
      String(tag).trim() === ""
    ) {

      return 999999

    }


    const numero =
      parseInt(
        String(tag).replace(
          /\D/g,
          ""
        ),
        10
      )


    return Number.isNaN(
      numero
    )
      ? 999999
      : numero

  }


  /* ===================================================== */
  /* FILTRAR PACIENTES                                     */
  /* ===================================================== */

  let pacientesFiltrados =
    pacientes.filter(
      paciente => {

        const textoBusca =
          buscaPaciente
            .trim()
            .toLowerCase()


        const nome =
          String(
            paciente.nome || ""
          ).toLowerCase()


        const apelido =
          String(
            paciente.apelido || ""
          ).toLowerCase()


        const tag =
          String(
            obterTag(
              paciente
            )
          ).toLowerCase()


        const passouBusca =
          !textoBusca ||
          nome.includes(
            textoBusca
          ) ||
          apelido.includes(
            textoBusca
          ) ||
          tag.includes(
            textoBusca.replace(
              /^#/,
              ""
            )
          )


        const passouTag =
          filtroTag === "todas"
            ? true
            : String(
                obterTag(
                  paciente
                )
              ) ===
              String(
                filtroTag
              )


        return (
          passouBusca &&
          passouTag
        )

      }
    )


  /* ===================================================== */
  /* ORDENAR                                               */
  /* ===================================================== */

  pacientesFiltrados =
    [
      ...pacientesFiltrados
    ].sort(
      (a, b) => {

        const nomeA =
          String(
            a.nome || ""
          ).toLowerCase()


        const nomeB =
          String(
            b.nome || ""
          ).toLowerCase()


        if (
          ordemPacientes ===
          "nome-az"
        ) {

          return nomeA.localeCompare(
            nomeB,
            "pt-BR"
          )

        }


        if (
          ordemPacientes ===
          "nome-za"
        ) {

          return nomeB.localeCompare(
            nomeA,
            "pt-BR"
          )

        }


        if (
          ordemPacientes ===
          "tag-crescente"
        ) {

          return (
            valorTag(a) -
            valorTag(b)
          )

        }


        if (
          ordemPacientes ===
          "tag-decrescente"
        ) {

          return (
            valorTag(b) -
            valorTag(a)
          )

        }


        return 0

      }
    )


  /* ===================================================== */
  /* TAGS DISPONÍVEIS                                      */
  /* ===================================================== */

  const tagsDisponiveis =
    [
      ...new Set(
        pacientes
          .map(
            paciente =>
              obterTag(
                paciente
              )
          )
          .filter(
            tag =>
              tag !== "" &&
              tag !== null &&
              tag !== undefined
          )
          .map(
            tag =>
              String(tag)
          )
      )
    ].sort(
      (a, b) => {

        const numeroA =
          parseInt(
            a.replace(
              /\D/g,
              ""
            ),
            10
          )


        const numeroB =
          parseInt(
            b.replace(
              /\D/g,
              ""
            ),
            10
          )


        if (
          !Number.isNaN(
            numeroA
          ) &&
          !Number.isNaN(
            numeroB
          )
        ) {

          return (
            numeroA -
            numeroB
          )

        }


        return a.localeCompare(
          b,
          "pt-BR"
        )

      }
    )


  /* ===================================================== */
  /* FORMATAR DATA                                         */
  /* ===================================================== */

  function formatarData(
    data
  ) {

    if (!data) {
      return "-"
    }


    const dataObj =
      new Date(
        `${data}T00:00:00`
      )


    if (
      Number.isNaN(
        dataObj.getTime()
      )
    ) {

      return "-"
    }


    return dataObj.toLocaleDateString(
      "pt-BR"
    )

  }


  /* ===================================================== */
  /* CALCULAR DATA FUTURA                                  */
  /* ===================================================== */

  function calcularDataFutura(
    data,
    quantidade,
    tipo
  ) {

    if (!data) {
      return ""
    }


    const numero =
      Number(
        quantidade
      )


    if (
      !Number.isFinite(
        numero
      ) ||
      numero <= 0
    ) {

      return ""

    }


    const dataObj =
      new Date(
        `${data}T00:00:00`
      )


    if (
      Number.isNaN(
        dataObj.getTime()
      )
    ) {

      return ""

    }


    if (
      tipo === "dia"
    ) {

      dataObj.setDate(
        dataObj.getDate() +
        numero
      )

    }


    if (
      tipo === "semana"
    ) {

      dataObj.setDate(
        dataObj.getDate() +
        numero * 7
      )

    }


    if (
      tipo === "mes"
    ) {

      const diaOriginal =
        dataObj.getDate()


      dataObj.setDate(
        1
      )


      dataObj.setMonth(
        dataObj.getMonth() +
        numero
      )


      const ultimoDia =
        new Date(
          dataObj.getFullYear(),
          dataObj.getMonth() + 1,
          0
        ).getDate()


      dataObj.setDate(
        Math.min(
          diaOriginal,
          ultimoDia
        )
      )

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


    return (
      `${ano}-${mes}-${dia}`
    )

  }


  /* ===================================================== */
  /* DATA DO REAGENDAMENTO                                 */
  /* ===================================================== */

  function calcularDataReagendamento() {

    const data =
      dataConsulta ||
      novoAgendamento.data


    if (
      !data ||
      reagendamento ===
      "nenhum"
    ) {

      return ""

    }


    if (
      reagendamento ===
      "1-mes"
    ) {

      return calcularDataFutura(
        data,
        1,
        "mes"
      )

    }


    if (
      reagendamento ===
      "4-meses"
    ) {

      return calcularDataFutura(
        data,
        4,
        "mes"
      )

    }


    if (
      reagendamento ===
      "6-meses"
    ) {

      return calcularDataFutura(
        data,
        6,
        "mes"
      )

    }


    if (
      reagendamento ===
      "personalizado"
    ) {

      return calcularDataFutura(
        data,
        personalizadoValor,
        personalizadoTipo
      )

    }


    return ""

  }


  const dataProxima =
    calcularDataReagendamento()


  /* ===================================================== */
  /* ALTERAR HORÁRIO                                       */
  /* ===================================================== */

  function alterarHora(
    hora
  ) {

    setNovoAgendamento({

      ...novoAgendamento,

      hora

    })

  }


  /* ===================================================== */
  /* SELECIONAR PACIENTE                                   */
  /* ===================================================== */

  function selecionarPaciente(
    paciente
  ) {

    setPacienteSelecionado(
      paciente
    )


    setBuscaPaciente(
      paciente.nome || ""
    )


    const tipo =
      String(
        paciente.tipoPaciente ||
        ""
      )
        .trim()
        .toLowerCase()


    if (
      tipo === "ortodontia"
    ) {

      setReagendamento(
        "1-mes"
      )

    } else {

      setReagendamento(
        "nenhum"
      )

    }

  }


  /* ===================================================== */
  /* CADASTRAR NOVO PACIENTE                               */
  /* ===================================================== */

  function cadastrarNovoPaciente() {

    if (
      !abrirCadastroPaciente
    ) {

      return

    }


    abrirCadastroPaciente({

      ...novoAgendamento,

      data:
        dataConsulta ||
        novoAgendamento.data

    })

  }


  /* ===================================================== */
  /* STATUS                                                */
  /* ===================================================== */

  function alterarStatus(
    status
  ) {

    setStatusConsulta(
      status
    )


    if (
      status !== "pagou"
    ) {

      setValorPago("")
      setFormaPagamento("")
      setParcelas("")

    }

  }


  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <div className="modal-bg">

      <div className="modal-box novo-agendamento-modal">

        <div className="novo-agendamento-cabecalho">

          <h2>
            Novo Agendamento
          </h2>


          <div className="novo-agendamento-info">

            <p>
              📅

              <span>
                {
                  formatarData(
                    dataConsulta ||
                    novoAgendamento.data
                  )
                }
              </span>
            </p>


            <p>
              ⏰

              <span>
                {
                  novoAgendamento.hora
                }
              </span>
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* TRÊS PARTES                                       */}
        {/* ================================================= */}

        <div className="novo-agendamento-colunas">


          {/* ================================================= */}
          {/* CONSULTA                                           */}
          {/* ================================================= */}

          <div className="novo-agendamento-consulta">

            <div className="novo-agendamento-coluna-titulo">
              Consulta
            </div>


            <div className="novo-agendamento-secao">

              <label className="novo-agendamento-label">
                Data da consulta
              </label>

              <input
                type="date"
                className="valor-input"
                value={
                  dataConsulta ||
                  novoAgendamento.data ||
                  ""
                }
                onChange={
                  e =>
                    setDataConsulta(
                      e.target.value
                    )
                }
              />

            </div>


            <div className="novo-agendamento-secao">

              <label className="novo-agendamento-label">
                Horário
              </label>

              <select
                className="valor-input"
                value={
                  novoAgendamento.hora ||
                  "08:00"
                }
                onChange={
                  e =>
                    alterarHora(
                      e.target.value
                    )
                }
              >

                {
                  horarios.map(
                    hora => (

                      <option
                        key={hora}
                        value={hora}
                      >
                        {hora}
                      </option>

                    )
                  )
                }

              </select>

            </div>


            <div className="novo-agendamento-status-box">

              <label className="novo-agendamento-label">
                Status da consulta
              </label>

              <select
                className="valor-input"
                value={
                  statusConsulta
                }
                onChange={
                  e =>
                    alterarStatus(
                      e.target.value
                    )
                }
              >

                <option value="agendado">
                  Agendado
                </option>

                <option value="confirmado">
                  Confirmado
                </option>

                <option value="faltou">
                  Faltou
                </option>

                <option value="pendente">
                  Pagamento pendente
                </option>

                <option value="pagou">
                  Pagou
                </option>

              </select>

            </div>


            {
              statusConsulta ===
              "pagou" && (

                <div className="novo-agendamento-pagamento">

                  <div className="novo-agendamento-pagamento-titulo">
                    Registrar pagamento
                  </div>


                  <label>
                    Forma de pagamento
                  </label>


                  <select
                    value={
                      formaPagamento || ""
                    }
                    onChange={
                      e =>
                        setFormaPagamento(
                          e.target.value
                        )
                    }
                  >

                    <option value="">
                      Selecione
                    </option>

                    <option value="dinheiro">
                      Dinheiro
                    </option>

                    <option value="pix">
                      PIX
                    </option>

                    <option value="debito">
                      Débito
                    </option>

                    <option value="credito_avista">
                      Crédito à vista
                    </option>

                    <option value="credito_parcelado">
                      Crédito parcelado
                    </option>

                  </select>


                  <label>
                    Valor pago
                  </label>


                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      valorPago || ""
                    }
                    onChange={
                      e =>
                        setValorPago(
                          e.target.value
                        )
                    }
                    placeholder="0,00"
                  />


                  {
                    formaPagamento ===
                    "credito_parcelado" && (

                      <>

                        <label>
                          Número de parcelas
                        </label>

                        <select
                          value={
                            parcelas || "2"
                          }
                          onChange={
                            e =>
                              setParcelas(
                                e.target.value
                              )
                          }
                        >

                          <option value="2">
                            2x
                          </option>

                          <option value="3">
                            3x
                          </option>

                          <option value="4">
                            4x
                          </option>

                          <option value="5">
                            5x
                          </option>

                          <option value="6">
                            6x
                          </option>

                        </select>

                      </>

                    )
                  }

                </div>

              )
            }


            <div className="ultimo-paciente-box">

              <div className="ultimo-paciente-titulo">
                Último paciente visto
              </div>


              {
                ultimoPacienteVisto
                  ? (

                    <button
                      type="button"
                      className={`
                        ultimo-paciente-btn
                        ${
                          pacienteSelecionado?.id ===
                          ultimoPacienteVisto.id
                            ? "ativo"
                            : ""
                        }
                      `}
                      onClick={
                        () =>
                          selecionarPaciente(
                            ultimoPacienteVisto
                          )
                      }
                    >

                      <span className="ultimo-paciente-tag">
                        {
                          formatarTag(
                            ultimoPacienteVisto
                          )
                        }
                      </span>

                      <span className="ultimo-paciente-nome">
                        {
                          ultimoPacienteVisto.nome
                        }
                      </span>

                      <span className="ultimo-paciente-acao">
                        Selecionar
                      </span>

                    </button>

                  )
                  : (

                    <div className="ultimo-paciente-vazio">
                      Nenhum paciente visto ainda
                    </div>

                  )
              }

            </div>

          </div>


          {/* ================================================= */}
          {/* PACIENTE                                           */}
          {/* ================================================= */}

          <div className="novo-agendamento-paciente">

            <div className="novo-agendamento-coluna-titulo">
              Paciente
            </div>


            <input
              type="text"
              className="valor-input"
              placeholder="Pesquisar paciente..."
              value={
                buscaPaciente
              }
              onChange={
                e => {

                  setBuscaPaciente(
                    e.target.value
                  )

                  setPacienteSelecionado(
                    null
                  )

                }
              }
            />


            <div className="filtros-pacientes-agendamento">

              <select
                value={
                  filtroTag
                }
                onChange={
                  e =>
                    setFiltroTag(
                      e.target.value
                    )
                }
              >

                <option value="todas">
                  Todas as tags
                </option>


                {
                  tagsDisponiveis.map(
                    tag => (

                      <option
                        key={tag}
                        value={tag}
                      >
                        #{tag.replace(
                          /^#/,
                          ""
                        )}
                      </option>

                    )
                  )
                }

              </select>


              <select
                value={
                  ordemPacientes
                }
                onChange={
                  e =>
                    setOrdemPacientes(
                      e.target.value
                    )
                }
              >

                <option value="nome-az">
                  Nome A → Z
                </option>

                <option value="nome-za">
                  Nome Z → A
                </option>

                <option value="tag-crescente">
                  Tag crescente
                </option>

                <option value="tag-decrescente">
                  Tag decrescente
                </option>

              </select>

            </div>


            <div className="paciente-escolhido-box">

              {
                pacienteSelecionado
                  ? (

                    <div className="paciente-escolhido">

                      <span className="paciente-escolhido-tag">
                        {
                          formatarTag(
                            pacienteSelecionado
                          )
                        }
                      </span>

                      <strong>
                        {
                          pacienteSelecionado.nome
                        }
                      </strong>

                    </div>

                  )
                  : (

                    <div className="paciente-escolhido-vazio">
                      Selecione um paciente
                    </div>

                  )
              }

            </div>


            <div className="lista-pacientes-agendamento">

              {
                pacientesFiltrados.length > 0

                  ? (

                    pacientesFiltrados.map(
                      paciente => (

                        <button
                          key={
                            paciente.id
                          }
                          type="button"
                          className={`
                            paciente-agendamento-btn
                            ${
                              pacienteSelecionado?.id ===
                              paciente.id
                                ? "paciente-selecionado"
                                : ""
                            }
                          `}
                          onClick={
                            () =>
                              selecionarPaciente(
                                paciente
                              )
                          }
                        >

                          {
                            formatarTag(
                              paciente
                            ) && (

                              <span className="paciente-tag-lista">
                                {
                                  formatarTag(
                                    paciente
                                  )
                                }
                              </span>

                            )
                          }


                          <span className="paciente-nome-lista">
                            {
                              paciente.nome
                            }
                          </span>

                        </button>

                      )
                    )

                  )
                  : (

                    <div className="nenhum-paciente">
                      Nenhum paciente encontrado
                    </div>

                  )
              }

            </div>


            <button
              type="button"
              className="cadastrar-paciente-agendamento"
              onClick={
                cadastrarNovoPaciente
              }
            >
              ＋ Cadastrar novo paciente
            </button>

          </div>


          {/* ================================================= */}
          {/* REAGENDAMENTO                                      */}
          {/* ================================================= */}

          <div className="novo-agendamento-reagendamento">

            <div className="novo-agendamento-coluna-titulo">
              Reagendamento
            </div>


            <div className="reagendamento-box">

              <div className="reagendamento-titulo">
                Reagendamento automático
              </div>


              <p className="reagendamento-descricao">
                Criar próximas consultas no mesmo horário.
              </p>


              <select
                className="valor-input"
                value={
                  reagendamento
                }
                onChange={
                  e =>
                    setReagendamento(
                      e.target.value
                    )
                }
              >

                <option value="nenhum">
                  Não reagendar
                </option>

                <option value="1-mes">
                  1 mês
                </option>

                <option value="4-meses">
                  4 meses
                </option>

                <option value="6-meses">
                  6 meses
                </option>

                <option value="personalizado">
                  Personalizado
                </option>

              </select>


              {
                reagendamento ===
                "personalizado" && (

                  <div className="reagendamento-personalizado">

                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Valor"
                      value={
                        personalizadoValor
                      }
                      onChange={
                        e =>
                          setPersonalizadoValor(
                            e.target.value
                          )
                      }
                    />


                    <select
                      value={
                        personalizadoTipo
                      }
                      onChange={
                        e =>
                          setPersonalizadoTipo(
                            e.target.value
                          )
                      }
                    >

                      <option value="dia">
                        Dia
                      </option>

                      <option value="semana">
                        Semana
                      </option>

                      <option value="mes">
                        Mês
                      </option>

                    </select>

                  </div>

                )
              }


              {
                reagendamento !==
                "nenhum" && (

                  <div className="reagendamento-ate">

                    <label>
                      Repetir até
                    </label>


                    <input
                      type="date"
                      value={
                        repetirAte
                      }
                      min={
                        dataConsulta ||
                        novoAgendamento.data ||
                        ""
                      }
                      onChange={
                        e =>
                          setRepetirAte(
                            e.target.value
                          )
                      }
                    />

                  </div>

                )
              }


              {
                dataProxima && (

                  <div className="reagendamento-preview">

                    <span>
                      Próxima consulta
                    </span>


                    <strong>
                      {
                        formatarData(
                          dataProxima
                        )
                      }

                      {" às "}

                      {
                        novoAgendamento.hora
                      }

                    </strong>


                    {
                      repetirAte && (

                        <small>
                          Até {formatarData(repetirAte)}
                        </small>

                      )
                    }

                  </div>

                )
              }

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* BOTÕES                                            */}
        {/* ================================================= */}

        <div className="novo-agendamento-botoes">

          <button
            type="button"
            className="novo-agendar-btn"
            onClick={
              () =>
                criarAgendamento(
                  reagendamento,
                  statusConsulta,
                  {
                    valorPago,
                    formaPagamento,
                    parcelas,
                    personalizadoValor,
                    personalizadoTipo,
                    repetirAte,
                    reagendamentoPersonalizado:
                      reagendamento === "personalizado"
                        ? `personalizado-${personalizadoValor}-${personalizadoTipo}`
                        : ""
                  }
                )
            }
          >
            Agendar
          </button>


          <button
            type="button"
            className="fechar-modal-btn"
            onClick={
              fechar
            }
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>

  )
}


export default NovoAgendamentoModal