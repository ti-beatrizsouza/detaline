// src/components/AgendaGrid.jsx

import AgendaHeader from "./AgendaHeader"
import ConsultaCard from "./ConsultaCard"

import {
  getCor,
  getDataDaColuna,
  gerarDataSlot
} from "../utils/agendaUtils"

function AgendaGrid({
  dias,
  horarios,
  consultas,
  pacientes,
  offsetSemana,
  setSelecionada,
  setNovoAgendamento,
  setDataConsulta,
  setObsEditando,
  ganhoDoDia,
  ganhoDaSemana
}) {

  return (
    <div className="agenda-scroll">

      <div
        className="agenda-grid"
        style={{
          gridTemplateColumns:
            "55px repeat(6, minmax(0, 1fr))",

          gridTemplateRows: `
            48px
            repeat(${horarios.length}, minmax(0, 1fr))
            30px
            34px
          `
        }}
      >

        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <div className="agenda-header">
          Horário
        </div>

        {dias.map((dia, index) => (
          <AgendaHeader
            key={`${dia}-${index}`}
            dia={dia}
            index={index}
            offsetSemana={offsetSemana ?? 0}
          />
        ))}


        {/* ================================================= */}
        {/* HORÁRIOS */}
        {/* ================================================= */}

        {horarios.map((hora) => (

          <div
            key={hora}
            style={{
              display: "contents"
            }}
          >

            {/* HORA */}

            <div className="hora-cell">
              {hora}
            </div>


            {/* DIAS */}

            {dias.map((dia, index) => {

              const dataAtual =
                getDataDaColuna(
                  index,
                  offsetSemana
                )

              const dataSlot =
                gerarDataSlot(dataAtual)


              const consulta =
                consultas.find(
                  (c) =>
                    c.data === dataSlot &&
                    c.hora === hora
                )


              const corConsulta =
                consulta
                  ? getCor(consulta.status)
                  : ""


              return (

                <div
                  key={`${dataSlot}-${hora}`}
                  className={`agenda-slot ${corConsulta}`}
                >

                  {consulta ? (

                    <ConsultaCard
                      consulta={consulta}
                      pacientes={pacientes}
                      setSelecionada={setSelecionada}
                      setObsEditando={setObsEditando}
                    />

                  ) : (

                    <button
                      type="button"
                      className="slot-vazio"
                      onClick={() => {

                        /*
                         * setDataConsulta é opcional.
                         * Assim o + continua funcionando mesmo
                         * se o componente pai não estiver passando
                         * essa função.
                         */

                        if (setDataConsulta) {
                          setDataConsulta(dataSlot)
                        }

                        setNovoAgendamento({
                          dia,
                          hora,
                          data: dataSlot
                        })

                      }}
                    >
                      +
                    </button>

                  )}

                </div>

              )

            })}

          </div>

        ))}


        {/* ================================================= */}
        {/* GANHO DO DIA */}
        {/* ================================================= */}

        <div className="hora-cell ganho-label">
          Ganho
        </div>

        {dias.map((dia, index) => {

          const dataAtual =
            getDataDaColuna(
              index,
              offsetSemana
            )

          const dataSlot =
            gerarDataSlot(dataAtual)


          return (

            <div
              key={`ganho-${dataSlot}`}
              className="ganho-cell"
            >

              <strong>
                R${" "}
                {ganhoDoDia(dataSlot).toFixed(2)}
              </strong>

            </div>

          )

        })}


        {/* ================================================= */}
        {/* GANHO DA SEMANA */}
        {/* ================================================= */}

        <div className="hora-cell ganho-label">
          Semana
        </div>

        <div
          className="ganho-semana"
          style={{
            gridColumn: "2 / span 6"
          }}
        >

          <strong>
            R${" "}
            {ganhoDaSemana().toFixed(2)}
          </strong>

        </div>

      </div>

    </div>
  )
}

export default AgendaGrid