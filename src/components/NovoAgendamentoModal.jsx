// src/components/NovoAgendamentoModal.jsx

function NovoAgendamentoModal({
  novoAgendamento,
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

  if (!novoAgendamento) return null

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome
      ?.toLowerCase()
      .includes(
        buscaPaciente.trim().toLowerCase()
      )
  )

  return (

    <div className="modal-bg">

      <div className="modal-box novo-agendamento-modal">

        <h2>
          Novo Agendamento
        </h2>

        <p>
          📅 {novoAgendamento.dia} • {
            new Date(
              novoAgendamento.data + "T00:00:00"
            ).toLocaleDateString("pt-BR")
          }
        </p>

        <p>
          ⏰ {novoAgendamento.hora}
        </p>

        <input
          type="date"
          className="valor-input"
          value={
            dataConsulta ||
            novoAgendamento.data ||
            ""
          }
          onChange={(e) =>
            setDataConsulta(e.target.value)
          }
        />

        <input
          type="text"
          className="valor-input"
          placeholder="Pesquisar paciente..."
          value={buscaPaciente}
          onChange={(e) => {

            setBuscaPaciente(e.target.value)
            setPacienteSelecionado(null)

          }}
        />

        {/* LISTA DE PACIENTES */}
        <div className="lista-pacientes-agendamento">

          {pacientesFiltrados.length > 0 ? (

            pacientesFiltrados.map((paciente) => (

              <button
                key={paciente.id}
                type="button"
                className={
                  `paciente-agendamento-btn ${
                    pacienteSelecionado?.id === paciente.id
                      ? "paciente-selecionado"
                      : ""
                  }`
                }
                onClick={() => {

                  setPacienteSelecionado(paciente)
                  setBuscaPaciente(paciente.nome)

                }}
              >

                <span>
                  {paciente.nome}
                </span>

              </button>

            ))

          ) : (

            <div className="nenhum-paciente">

              Nenhum paciente encontrado

            </div>

          )}

        </div>

        {/* CADASTRAR NOVO PACIENTE */}
        <button
          type="button"
          className="cadastrar-paciente-agendamento"
          onClick={() => {

            if (abrirCadastroPaciente) {
              abrirCadastroPaciente()
            }

          }}
        >

          ＋ Cadastrar novo paciente

        </button>

        {pacienteSelecionado && (

          <div className="paciente-escolhido">

            Paciente:

            <strong>
              {pacienteSelecionado.nome}
            </strong>

          </div>

        )}

        <div className="modal-botoes">

          <button
            type="button"
            onClick={criarAgendamento}
          >
            Agendar
          </button>

          <button
            type="button"
            className="fechar-modal-btn"
            onClick={fechar}
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>

  )

}

export default NovoAgendamentoModal