function ConsultaCard({
  consulta,
  pacientes,
  setSelecionada,
  setObsEditando,
}) {
  return (
    <button
      className="consulta-btn"
      onClick={() => {
        const paciente = pacientes.find(
          (p) => p.id === consulta.pacienteId
        )

        setObsEditando(
          paciente?.obs || ""
        )

        setSelecionada(consulta)
      }}
    >
      <div className="consulta-info">
        <span>
          {consulta.nome}
        </span>

        <small>
          {new Date(
            consulta.data + "T00:00:00"
          ).toLocaleDateString("pt-BR")}
        </small>

        {consulta.valorPago > 0 && (
          <small>
            R$ {consulta.valorPago}
          </small>
        )}
      </div>
    </button>
  )
}

export default ConsultaCard