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
  return (
    <div className="agenda-scroll">
      <div className="agenda-grid">

        {/* Cabeçalho */}
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

        {/* Horários */}
        {horarios.map((hora) => (
          <div
            key={hora}
            style={{ display: "contents" }}
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
                      ? getCor(
                          consulta.status
                        )
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

        {/* Ganho do dia */}

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

        {/* Ganho semanal */}

        <div className="hora-cell ganho-label">
          Semana
        </div>

        <div
          className="ganho-semana"
          style={{
            gridColumn:
              "2 / span 6"
          }}
        >

          <strong>
            R${" "}
            {ganhoDaSemana().toFixed(
              2
            )}
          </strong>

        </div>

      </div>
    </div>
  )
}

export default AgendaGrid