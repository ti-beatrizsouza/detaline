import {
  useMemo,
  useState
} from "react"

import "../styles/listaPacientes.css"

import logob from "../assets/logob.png"

import usePacientes from "../hooks/usePacientes"


function ListaPacientes({

  voltar,
  abrirPerfil,
  abrirCadastro

}) {

  const pacientes =
    usePacientes()


  /* ===================================================== */
  /* FILTROS                                               */
  /* ===================================================== */

  const [
    filtroNome,
    setFiltroNome
  ] = useState("")


  const [
    filtroTag,
    setFiltroTag
  ] = useState("")


  /* ===================================================== */
  /* ORDENAÇÃO                                              */
  /* ===================================================== */

  const [
    ordenacao,
    setOrdenacao
  ] = useState(
    "tag-crescente"
  )


  const [
    menuOrdenacao,
    setMenuOrdenacao
  ] = useState(false)


  /* ===================================================== */
  /* DATA DE NASCIMENTO                                    */
  /* ===================================================== */

  function formatarDataNascimento(
    data
  ) {

    if (!data) {

      return "Não informada"

    }


    if (
      typeof data === "string" &&
      data.includes("/")
    ) {

      return data

    }


    const partes =
      String(data).split("-")


    if (
      partes.length === 3
    ) {

      return `${partes[2]}/${partes[1]}/${partes[0]}`

    }


    return data

  }


  /* ===================================================== */
  /* RESPONSÁVEL                                           */
  /* ===================================================== */

  function encontrarResponsavel(
    paciente
  ) {

    return (
      paciente.responsavel ||
      paciente.nomeResponsavel ||
      paciente.contatoResponsavel ||
      "Não informado"
    )

  }


  /* ===================================================== */
  /* PACIENTES FILTRADOS                                  */
  /* ===================================================== */

  const pacientesFiltrados =
    useMemo(() => {

      const nome =
        filtroNome
          .trim()
          .toLowerCase()


      const tag =
        filtroTag
          .trim()
          .replace(
            "#",
            ""
          )


      const filtrados =
        pacientes.filter(
          (paciente) => {

            const nomePaciente =
              String(
                paciente.nome || ""
              ).toLowerCase()


            const tagPaciente =
              String(
                paciente.tag || ""
              )
                .replace(
                  "#",
                  ""
                )


            const correspondeNome =
              !nome ||
              nomePaciente.includes(
                nome
              )


            const correspondeTag =
              !tag ||
              tagPaciente === tag


            return (
              correspondeNome &&
              correspondeTag
            )

          }
        )


      /* ================================================ */
      /* ORDENAÇÃO                                        */
      /* ================================================ */

      filtrados.sort(
        (a, b) => {

          switch (
            ordenacao
          ) {

            /* ------------------------------------------ */
            /* NOME A-Z                                   */
            /* ------------------------------------------ */

            case "nome-az":

              return String(
                a.nome || ""
              ).localeCompare(
                String(
                  b.nome || ""
                ),
                "pt-BR",
                {
                  sensitivity: "base"
                }
              )


            /* ------------------------------------------ */
            /* NOME Z-A                                   */
            /* ------------------------------------------ */

            case "nome-za":

              return String(
                b.nome || ""
              ).localeCompare(
                String(
                  a.nome || ""
                ),
                "pt-BR",
                {
                  sensitivity: "base"
                }
              )


            /* ------------------------------------------ */
            /* TAG CRESCENTE                              */
            /* ------------------------------------------ */

            case "tag-crescente": {

              const tagA =
                parseInt(
                  String(
                    a.tag || ""
                  ).replace(
                    "#",
                    ""
                  ),
                  10
                )


              const tagB =
                parseInt(
                  String(
                    b.tag || ""
                  ).replace(
                    "#",
                    ""
                  ),
                  10
                )


              /*
                Pacientes sem tag ficam
                no final da lista.
              */

              const numeroA =
                Number.isNaN(tagA)
                  ? Infinity
                  : tagA


              const numeroB =
                Number.isNaN(tagB)
                  ? Infinity
                  : tagB


              return (
                numeroA -
                numeroB
              )

            }


            /* ------------------------------------------ */
            /* TAG DECRESCENTE                            */
            /* ------------------------------------------ */

            case "tag-decrescente": {

              const tagA =
                parseInt(
                  String(
                    a.tag || ""
                  ).replace(
                    "#",
                    ""
                  ),
                  10
                )


              const tagB =
                parseInt(
                  String(
                    b.tag || ""
                  ).replace(
                    "#",
                    ""
                  ),
                  10
                )


              const numeroA =
                Number.isNaN(tagA)
                  ? -Infinity
                  : tagA


              const numeroB =
                Number.isNaN(tagB)
                  ? -Infinity
                  : tagB


              return (
                numeroB -
                numeroA
              )

            }


            default:

              return 0

          }

        }
      )


      return filtrados

    }, [

      pacientes,

      filtroNome,

      filtroTag,

      ordenacao

    ])


  /* ===================================================== */
  /* NOME DA ORDENAÇÃO                                    */
  /* ===================================================== */

  function nomeOrdenacao() {

    switch (
      ordenacao
    ) {

      case "nome-az":

        return "Nome: A–Z"


      case "nome-za":

        return "Nome: Z–A"


      case "tag-crescente":

        return "Tag: crescente"


      case "tag-decrescente":

        return "Tag: decrescente"


      default:

        return "Ordenar"

    }

  }


  /* ===================================================== */
  /* LIMPAR FILTROS                                       */
  /* ===================================================== */

  function limparFiltros() {

    setFiltroNome("")

    setFiltroTag("")

  }


  /* ===================================================== */
  /* RENDER                                               */
  /* ===================================================== */

  return (

    <main className="pacientes-container">


      {/* ================================================= */}
      {/* BRILHOS                                           */}
      {/* ================================================= */}

      <div
        className="
          pacientes-brilho
          pacientes-brilho-1
        "
      />

      <div
        className="
          pacientes-brilho
          pacientes-brilho-2
        "
      />


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <header className="pacientes-topo">


        <div className="pacientes-marca">

          <img
            src={logob}
            alt="Dentaline"
            className="pacientes-logo"
          />


          <div className="pacientes-titulo">

            <span>
              DENTALINE
            </span>

            <h1>
              Pacientes
            </h1>

            <p>
              Gerencie os pacientes cadastrados na clínica.
            </p>

          </div>

        </div>


        <div className="pacientes-topo-acoes">

          <button
            className="pacientes-voltar"
            onClick={voltar}
          >
            ← Dashboard
          </button>


          <button
            className="novo-paciente-btn"
            onClick={abrirCadastro}
          >
            + Cadastrar Paciente
          </button>

        </div>

      </header>


      {/* ================================================= */}
      {/* RESUMO                                            */}
      {/* ================================================= */}

      <section className="pacientes-resumo">

        <div className="pacientes-resumo-card">

          <span>
            Total de pacientes
          </span>

          <strong>
            {pacientes.length}
          </strong>

        </div>


        <div className="pacientes-resumo-card">

          <span>
            Exibindo
          </span>

          <strong>
            {pacientesFiltrados.length}
          </strong>

        </div>

      </section>


      {/* ================================================= */}
      {/* FILTROS                                           */}
      {/* ================================================= */}

      <section className="pacientes-filtros">


        {/* BUSCAR POR NOME */}

        <div className="filtro-grupo">

          <label>
            Buscar por nome
          </label>

          <div className="filtro-input-wrapper">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="
                Digite o nome do paciente...
              "
              value={filtroNome}
              onChange={(e) =>
                setFiltroNome(
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* FILTRAR POR TAG */}

        <div
          className="
            filtro-grupo
            filtro-tag-grupo
          "
        >

          <label>
            Filtrar por tag
          </label>

          <div className="filtro-input-wrapper">

            <span
              className="
                filtro-tag-icon
              "
            >
              #
            </span>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Ex.: 1"
              value={filtroTag}
              onChange={(e) =>
                setFiltroTag(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                )
              }
            />

          </div>

        </div>


        {/* ORDENAÇÃO */}

        <div className="ordenacao-wrapper">

          <label>
            Ordenar
          </label>


          <button
            type="button"
            className="ordenacao-btn"
            onClick={() =>
              setMenuOrdenacao(
                !menuOrdenacao
              )
            }
          >

            <span>
              {nomeOrdenacao()}
            </span>

            <span
              className="
                ordenacao-seta
              "
            >
              {
                menuOrdenacao
                  ? "⌃"
                  : "⌄"
              }
            </span>

          </button>


          {menuOrdenacao && (

            <div className="ordenacao-menu">


              {/* A-Z */}

              <button
                type="button"

                className={
                  ordenacao ===
                    "nome-az"
                    ? "ativo"
                    : ""
                }

                onClick={() => {

                  setOrdenacao(
                    "nome-az"
                  )

                  setMenuOrdenacao(
                    false
                  )

                }}
              >

                <span>
                  Nome
                </span>

                <strong>
                  A–Z
                </strong>

              </button>


              {/* Z-A */}

              <button
                type="button"

                className={
                  ordenacao ===
                    "nome-za"
                    ? "ativo"
                    : ""
                }

                onClick={() => {

                  setOrdenacao(
                    "nome-za"
                  )

                  setMenuOrdenacao(
                    false
                  )

                }}
              >

                <span>
                  Nome
                </span>

                <strong>
                  Z–A
                </strong>

              </button>


              {/* TAG CRESCENTE */}

              <button
                type="button"

                className={
                  ordenacao ===
                    "tag-crescente"
                    ? "ativo"
                    : ""
                }

                onClick={() => {

                  setOrdenacao(
                    "tag-crescente"
                  )

                  setMenuOrdenacao(
                    false
                  )

                }}
              >

                <span>
                  Tag
                </span>

                <strong>
                  ↑
                </strong>

              </button>


              {/* TAG DECRESCENTE */}

              <button
                type="button"

                className={
                  ordenacao ===
                    "tag-decrescente"
                    ? "ativo"
                    : ""
                }

                onClick={() => {

                  setOrdenacao(
                    "tag-decrescente"
                  )

                  setMenuOrdenacao(
                    false
                  )

                }}
              >

                <span>
                  Tag
                </span>

                <strong>
                  ↓
                </strong>

              </button>

            </div>

          )}

        </div>


        {/* LIMPAR */}

        <button
          type="button"
          className="limpar-filtros-btn"
          onClick={limparFiltros}
        >
          Limpar filtros
        </button>


      </section>


      {/* ================================================= */}
      {/* LISTA                                             */}
      {/* ================================================= */}

      <section className="pacientes-lista">


        {/* NENHUM PACIENTE */}

        {pacientes.length === 0 ? (

          <div className="pacientes-vazio">

            <img
              src={logob}
              alt="Dentaline"
            />

            <h2>
              Nenhum paciente cadastrado
            </h2>

            <p>
              Cadastre o primeiro paciente para começar.
            </p>

            <button
              type="button"
              onClick={abrirCadastro}
            >
              + Cadastrar Paciente
            </button>

          </div>


        ) : pacientesFiltrados.length === 0 ? (


          /* ============================================== */
          /* NENHUM RESULTADO                               */
          /* ============================================== */

          <div
            className="
              pacientes-vazio
              pacientes-sem-resultado
            "
          >

            <div
              className="
                sem-resultado-icon
              "
            >
              🔎
            </div>

            <h2>
              Nenhum paciente encontrado
            </h2>

            <p>
              Tente alterar os filtros utilizados.
            </p>

            <button
              type="button"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>

          </div>


        ) : (


          /* ============================================== */
          /* PACIENTES                                       */
          /* ============================================== */

          pacientesFiltrados.map(
            (paciente) => (

              <article
                key={paciente.id}

                className="paciente-card"

                onClick={() =>
                  abrirPerfil(
                    paciente,
                    "pacientes"
                  )
                }
              >


                {/* FOTO */}

                <div className="paciente-foto">

                  {
                    paciente.nome?.[0]
                      ?.toUpperCase()
                  }

                </div>


                {/* INFORMAÇÕES */}

                <div className="paciente-info">


                  <div className="paciente-nome-area">

                    <div>

                      <h2>
                        {paciente.nome}
                      </h2>

                      <span
                        className="
                          paciente-tag
                        "
                      >
                        {paciente.tag || "#—"}
                      </span>

                    </div>

                  </div>


                  <div className="paciente-detalhes">


                    {/* DATA DE NASCIMENTO */}

                    <p>

                      <span>
                        Data de nascimento:
                      </span>

                      {" "}

                      {
                        formatarDataNascimento(
                          paciente.dataNascimento ||
                          paciente.nascimento ||
                          paciente.dataNasc
                        )
                      }

                    </p>


                    {/* PRÓXIMA CONSULTA */}

                    <p>

                      <span>
                        Próxima consulta:
                      </span>

                      {" "}

                      {
                        paciente.proxConsulta ||
                        "Não definida"
                      }

                    </p>


                    {/* OBSERVAÇÕES */}

                    <p>

                      <span>
                        Observações:
                      </span>

                      {" "}

                      {
                        paciente.obs ||
                        "Sem observações"
                      }

                    </p>

                  </div>

                </div>


                {/* LATERAL */}

                <div className="paciente-lateral">

                  <span
                    className="
                      paciente-lateral-label
                    "
                  >
                    RESPONSÁVEL
                  </span>

                  <strong>
                    {
                      encontrarResponsavel(
                        paciente
                      )
                    }
                  </strong>

                  <span
                    className="
                      paciente-lateral-tag
                    "
                  >
                    {paciente.tag || "#—"}
                  </span>

                </div>


                {/* SETA */}

                <div className="paciente-seta">
                  →
                </div>


              </article>

            )
          )

        )}

      </section>


      {/* ================================================= */}
      {/* RODAPÉ                                            */}
      {/* ================================================= */}

      <footer className="pacientes-footer">

        <span>
          Dentaline
        </span>

        <span>
          {
            pacientesFiltrados.length
          }{" "}
          de{" "}
          {
            pacientes.length
          }{" "}
          paciente(s)
        </span>

      </footer>


    </main>

  )

}


export default ListaPacientes