// src/components/AgendaTopBar.jsx

import "../styles/agenda.css"
import logob from "../assets/logob.png"

function AgendaTopBar({
  voltar,
  abrirNovoAgendamento,
  offsetSemana,
  setOffsetSemana,
  dataPesquisa,
  setDataPesquisa,
  irParaData
}) {

  function pesquisarData() {
    if (!dataPesquisa) {
      return
    }

    irParaData(dataPesquisa)
  }

  function irParaHoje() {
    const hoje = new Date()

    const ano = hoje.getFullYear()

    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, "0")

    const dia = String(
      hoje.getDate()
    ).padStart(2, "0")

    const dataHoje =
      `${ano}-${mes}-${dia}`

    setDataPesquisa(dataHoje)

    irParaData(dataHoje)
  }

  return (
    <header className="agenda-topo">

      {/* ================================================= */}
      {/* ESQUERDA                                         */}
      {/* ================================================= */}

      <div className="agenda-topo-esquerda">

        <button
          type="button"
          className="agenda-voltar"
          onClick={voltar}
        >
          ← Dashboard
        </button>

      </div>


      {/* ================================================= */}
      {/* CENTRO                                            */}
      {/* ================================================= */}

      <div className="agenda-topo-centro">

        <div className="agenda-navegacao">

          <button
            type="button"
            onClick={() =>
              setOffsetSemana(
                offsetSemana - 1
              )
            }
          >
            ← Semana anterior
          </button>


          <button
            type="button"
            className="btn-hoje"
            onClick={irParaHoje}
          >
            Hoje
          </button>


          <div className="pesquisar-data-topo">

            <input
              type="date"
              value={dataPesquisa}
              onChange={(e) =>
                setDataPesquisa(
                  e.target.value
                )
              }
              aria-label="Pesquisar data"
            />

            <button
              type="button"
              onClick={pesquisarData}
            >
              Ir
            </button>

          </div>


          <button
            type="button"
            onClick={() =>
              setOffsetSemana(
                offsetSemana + 1
              )
            }
          >
            Próxima semana →
          </button>

        </div>


        {/* NOVO AGENDAMENTO FORA DA CAIXA */}

        <button
          type="button"
          className="novo-agendamento-topo-btn"
          onClick={abrirNovoAgendamento}
        >
          ＋ Novo agendamento
        </button>

      </div>


      {/* ================================================= */}
      {/* DIREITA                                           */}
      {/* ================================================= */}

      <div className="agenda-topo-marca">

        <div className="agenda-titulo">

          <span>
            ORGANIZAÇÃO
          </span>

          <h1>
            Agenda
          </h1>

        </div>


        <img
          src={logob}
          alt="Dentaline"
          className="agenda-logo-cantinho"
        />

      </div>

    </header>
  )
}

export default AgendaTopBar