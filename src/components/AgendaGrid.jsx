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
  setObsEditando,
  ganhoDoDia,
  ganhoDaSemana
}) {

  const totalLinhas = 1 + horarios.length + 2

  return (
    <div className="agenda-scroll">

      <div
        className="agenda-grid"
        style={{
          gridTemplateColumns: "55px repeat(6, minmax(0, 1fr))",
          gridTemplateRows: `
            48px
            repeat(${horarios.length}, minmax(0, 1fr))
            30px
            34px
          `
        }}
      >

        {/* CABEÇALHO */}

        <div className="agenda-header">
          Horário
        </div>

        {dias.map((dia, index) => (
          <AgendaHeader
            key={dia}
            dia={dia}
            index={index}
            offsetSemana={offsetSemana ?? 0}
          />
        ))}


        {/* HORÁRIOS */}

        {horarios.map((hora) => (

          <div
            key={hora}
            style={{
              display: "contents"
            }}
          >

            <div className="hora-cell">
              {hora}
            </div>

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
                  c =>
                    (
                      c.data === dataSlot ||
                      (
                        !c.data &&
                        c.dia === dia
                      )
                    ) &&
                    c.hora === hora
                )

              return (

                <div
                  key={`${dia}-${hora}`}
                  className={`agenda-slot ${
                    consulta
                      ? getCor(consulta.status)
                      : ""
                  }`}
                >

                  {consulta ? (

                    <ConsultaCard
                      consulta={consulta}
                      pacientes={pacientes}
                      setSelecionada={setSelecionada}
                      setObsEditando={setObsEditando}
                    />

                  ) : (

                    <div
                      className="slot-vazio"
                      onClick={() =>
                        setNovoAgendamento({
                          dia,
                          hora,
                          data: dataSlot
                        })
                      }
                    >
                      +
                    </div>

                  )}

                </div>

              )

            })}

          </div>

        ))}


        {/* GANHO DO DIA */}

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
              key={dataSlot}
              className="ganho-cell"
            >

              <strong>
                R${" "}
                {ganhoDoDia(
                  dataSlot
                ).toFixed(2)}
              </strong>

            </div>

          )

        })}


        {/* GANHO DA SEMANA */}

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