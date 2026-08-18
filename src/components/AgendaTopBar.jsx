// src/components/AgendaTopBar.jsx

import "../styles/agenda.css"
import logob from "../assets/logob.png"

function AgendaTopBar({
  voltar,
  pacientes,
  pacienteTopo,
  setPacienteTopo,
  diaTopo,
  setDiaTopo,
  irParaData,
  horaTopo,
  setHoraTopo,
  statusTopo,
  setStatusTopo,
  horarios,
  agendarPeloTopo,
  abrirCadastroDentista,
  offsetSemana,
  setOffsetSemana,
  dataPesquisa,
  setDataPesquisa
}) {

  function pesquisarData() {
    if (!dataPesquisa) return
    irParaData(dataPesquisa)
  }

  function irParaHoje() {
    const hoje = new Date().toISOString().split("T")[0]
    setDiaTopo(hoje)
    setDataPesquisa(hoje)
    irParaData(hoje)
  }

  return (
    <div className="agenda-topo">

      {/* BLOCO ESQUERDO: Voltar + Título */}
      <div className="agenda-bloco-esq">
        <button
          className="agenda-voltar"
          onClick={voltar}
        >
          ← Dashboard
        </button>

        <div className="agenda-titulo">
          <h1>Agenda</h1>
        </div>
      </div>


      {/* BLOCO CENTRAL: Paciente maior + Campos */}
      <div className="nova-consulta">
        <select
          value={pacienteTopo}
          onChange={(e) => {
            if (e.target.value === "__novo__") {
              abrirCadastroDentista()
              return
            }
            setPacienteTopo(e.target.value)
          }}
        >
          <option value="">Selecionar paciente...</option>
          <option value="__novo__">+ Cadastrar paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={diaTopo}
          onChange={(e) => {
            const novaData = e.target.value
            setDiaTopo(novaData)
            irParaData(novaData)
          }}
        />

        <select
          value={horaTopo}
          onChange={(e) => setHoraTopo(e.target.value)}
        >
          {horarios.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </select>

        <select
          value={statusTopo}
          onChange={(e) => setStatusTopo(e.target.value)}
        >
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="pagou">Realizado</option>
          <option value="pendente">Pendente</option>
          <option value="faltou">Faltou</option>
        </select>

        <button onClick={agendarPeloTopo}>
          Agendar
        </button>
      </div>


      {/* BLOCO DIREITO: Navegação completa + Logo grande */}
      <div className="agenda-bloco-dir">
        <div className="agenda-navegacao">
          <button
            onClick={() => setOffsetSemana(offsetSemana - 1)}
          >
            ← Semana Anterior
          </button>

          <button
            className="btn-hoje"
            onClick={irParaHoje}
          >
            Hoje
          </button>

<div
  className={`pesquisar-data-topo ${
    dataPesquisa ? "tem-data" : ""
  }`}
>
  {!dataPesquisa && (
    <span className="placeholder-data">
      Pesquisar data
    </span>
  )}

  <input
    type="date"
    value={dataPesquisa}
    onChange={(e) =>
      setDataPesquisa(e.target.value)
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
            onClick={() => setOffsetSemana(offsetSemana + 1)}
          >
            Próxima Semana →
          </button>
        </div>

        <img
          src={logob}
          alt="Dentaline"
          className="agenda-logo-cantinho"
        />
      </div>

    </div>
  )
}

export default AgendaTopBar