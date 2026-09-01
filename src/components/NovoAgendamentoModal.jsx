import { useState } from "react"

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
  abrirCadastroPaciente
}) {

  if (!novoAgendamento) {
    return null
  }


  /* ===================================================== */
  /* ESTADOS DOS FILTROS                                   */
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
  /* PEGAR TAG                                             */
  /* ===================================================== */

  function obterTag(paciente) {

    const tag =
      paciente?.tag ??
      paciente?.tags ??
      ""


    if (
      Array.isArray(tag)
    ) {

      return tag[0] ?? ""

    }


    return tag
  }


  function formatarTag(paciente) {

    const tag =
      obterTag(paciente)


    if (
      tag === null ||
      tag === undefined ||
      String(tag).trim() === ""
    ) {

      return ""

    }


    return `#${String(tag).replace(/^#/, "")}`
  }


  function valorTag(paciente) {

    const tag =
      obterTag(paciente)


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
      (paciente) => {

        const nome =
          paciente.nome
            ?.toLowerCase()
            .includes(
              buscaPaciente
                .trim()
                .toLowerCase()
            )


        const tag =
          obterTag(paciente)


        const passouTag =
          filtroTag === "todas"
            ? true
            : String(tag) ===
              String(filtroTag)


        return (
          nome &&
          passouTag
        )
      }
    )


  /* ===================================================== */
  /* ORDENAR                                               */
  /* ===================================================== */

  pacientesFiltrados =
    [...pacientesFiltrados]
      .sort(
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
            (paciente) =>
              obterTag(paciente)
          )
          .filter(
            (tag) =>
              tag !== "" &&
              tag !== null &&
              tag !== undefined
          )
          .map(
            (tag) =>
              String(tag)
          )
      )
    ]
      .sort(
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
            !Number.isNaN(numeroA) &&
            !Number.isNaN(numeroB)
          ) {

            return numeroA - numeroB

          }


          return a.localeCompare(
            b,
            "pt-BR"
          )

        }
      )


  /* ===================================================== */
  /* CADASTRAR NOVO                                        */
  /* ===================================================== */

  function cadastrarNovoPaciente() {

    if (
      abrirCadastroPaciente
    ) {

      abrirCadastroPaciente({
        ...novoAgendamento,

        data:
          dataConsulta ||
          novoAgendamento.data
      })

    }

  }


  /* ===================================================== */
  /* ALTERAR HORÁRIO                                       */
  /* ===================================================== */

  function alterarHora(hora) {

    setNovoAgendamento({
      ...novoAgendamento,

      hora
    })

  }


  /* ===================================================== */
  /* FORMATAR DATA                                         */
  /* ===================================================== */

  function formatarData(data) {

    if (!data) {
      return "-"
    }


    const dataObj =
      new Date(
        data +
        "T00:00:00"
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
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <div className="modal-bg">

      <div className="modal-box novo-agendamento-modal">


        {/* ================================================= */}
        {/* TÍTULO                                            */}
        {/* ================================================= */}

        <h2>
          Novo Agendamento
        </h2>


        {/* ================================================= */}
        {/* INFORMAÇÕES                                      */}
        {/* ================================================= */}

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


        {/* ================================================= */}
        {/* DATA                                              */}
        {/* ================================================= */}

        <label
          className="novo-agendamento-label"
        >
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
            (e) =>
              setDataConsulta(
                e.target.value
              )
          }
        />


        {/* ================================================= */}
        {/* HORÁRIO                                           */}
        {/* ================================================= */}

        <label
          className="novo-agendamento-label"
        >
          Horário
        </label>


        <select
          className="
            valor-input
            novo-agendamento-hora
          "
          value={
            novoAgendamento.hora ||
            "08:00"
          }
          onChange={
            (e) =>
              alterarHora(
                e.target.value
              )
          }
        >

          {
            horarios.map(
              (hora) => (

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


        {/* ================================================= */}
        {/* PACIENTE                                          */}
        {/* ================================================= */}

        <label
          className="novo-agendamento-label"
        >
          Paciente
        </label>


        <input
          type="text"
          className="valor-input"
          placeholder="Pesquisar paciente..."
          value={
            buscaPaciente
          }
          onChange={
            (e) => {

              setBuscaPaciente(
                e.target.value
              )

              setPacienteSelecionado(
                null
              )

            }
          }
        />


        {/* ================================================= */}
        {/* FILTROS                                           */}
        {/* ================================================= */}

        <div
          className="
            filtros-pacientes-agendamento
          "
        >

          {/* FILTRO POR TAG */}

          <select
            value={filtroTag}
            onChange={
              (e) =>
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
                (tag) => (

                  <option
                    key={tag}
                    value={tag}
                  >
                    #{tag.replace(/^#/, "")}
                  </option>

                )
              )
            }

          </select>


          {/* ORDEM */}

          <select
            value={
              ordemPacientes
            }
            onChange={
              (e) =>
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


        {/* ================================================= */}
        {/* LISTA                                             */}
        {/* ================================================= */}

        <div
          className="
            lista-pacientes-agendamento
          "
        >

          {
            pacientesFiltrados.length > 0

              ? (

                pacientesFiltrados.map(
                  (paciente) => (

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
                        () => {

                          setPacienteSelecionado(
                            paciente
                          )

                          setBuscaPaciente(
                            paciente.nome
                          )

                        }
                      }
                    >

                      {/* TAG */}

                      {
                        formatarTag(
                          paciente
                        ) && (

                          <span
                            className="
                              paciente-tag-lista
                            "
                          >
                            {
                              formatarTag(
                                paciente
                              )
                            }
                          </span>

                        )
                      }


                      {/* NOME */}

                      <span
                        className="
                          paciente-nome-lista
                        "
                      >
                        {
                          paciente.nome
                        }
                      </span>

                    </button>

                  )
                )

              )

              : (

                <div
                  className="
                    nenhum-paciente
                  "
                >
                  Nenhum paciente encontrado
                </div>

              )
          }

        </div>


        {/* ================================================= */}
        {/* CADASTRAR                                         */}
        {/* ================================================= */}

        <button
          type="button"
          className="
            cadastrar-paciente-agendamento
          "
          onClick={
            cadastrarNovoPaciente
          }
        >
          ＋ Cadastrar novo paciente
        </button>


        {/* ================================================= */}
        {/* PACIENTE ESCOLHIDO                                */}
        {/* ================================================= */}

        {
          pacienteSelecionado && (

            <div
              className="
                paciente-escolhido
              "
            >

              Paciente:

              {" "}

              {
                formatarTag(
                  pacienteSelecionado
                ) && (

                  <span
                    className="
                      paciente-escolhido-tag
                    "
                  >
                    {
                      formatarTag(
                        pacienteSelecionado
                      )
                    }
                  </span>

                )
              }


              <strong>
                {
                  pacienteSelecionado.nome
                }
              </strong>

            </div>

          )
        }


        {/* ================================================= */}
        {/* BOTÕES                                            */}
        {/* ================================================= */}

        <div
          className="
            novo-agendamento-botoes
          "
        >

          <button
            type="button"
            className="novo-agendar-btn"
            onClick={
              criarAgendamento
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