    import "../styles/agenda.css"

function AgendaTopBar({
  voltar,

  pacientes,

  pacienteTopo,
  setPacienteTopo,

  diaTopo,
  setDiaTopo,

  horaTopo,
  setHoraTopo,

  statusTopo,
  setStatusTopo,

  horarios,

  agendarPeloTopo,

  abrirCadastroDentista
}) {

  return (

    <>

      <div className="agenda-topo">

        <button
          className="agenda-voltar"
          onClick={voltar}
        >
          ← Dashboard
        </button>

        <h1>
          Agenda de Consultas
        </h1>

      </div>

      <div className="nova-consulta">

        <select
          value={pacienteTopo}
          onChange={(e) => {

            if (
              e.target.value === "__novo__"
            ) {

              abrirCadastroDentista()
              return

            }

            setPacienteTopo(
              e.target.value
            )

          }}
        >

          <option value="">
            Selecionar paciente
          </option>

          <option value="__novo__">
            + Cadastrar paciente
          </option>

          {pacientes.map((p) => (

            <option
              key={p.id}
              value={p.id}
            >
              {p.nome}
            </option>

          ))}

        </select>

        <input
          type="date"
          value={diaTopo}
          onChange={(e) =>
            setDiaTopo(
              e.target.value
            )
          }
        />

        <select
          value={horaTopo}
          onChange={(e) =>
            setHoraTopo(
              e.target.value
            )
          }
        >

          {horarios.map((hora) => (

            <option
              key={hora}
              value={hora}
            >
              {hora}
            </option>

          ))}

        </select>

        <select
          value={statusTopo}
          onChange={(e) =>
            setStatusTopo(
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

          <option value="pagou">
            Pagamento realizado
          </option>

          <option value="pendente">
            Pendente
          </option>

          <option value="faltou">
            Faltou
          </option>

        </select>

        <button
          onClick={agendarPeloTopo}
        >
          Agendar
        </button>

      </div>

    </>

  )

}

export default AgendaTopBar