function ConsultaCard({
  consulta,
  pacientes,
  setSelecionada,
  setObsEditando,
}) {

  return (

    <button
      type="button"
      className="consulta-btn"

      onClick={() => {

        const paciente =
          pacientes.find(
            (p) =>
              p.id ===
              consulta.pacienteId
          )

        setObsEditando(
          paciente?.obs || ""
        )

        setSelecionada(
          consulta
        )

      }}

    >

      <div className="consulta-info">

        <span>
          {consulta.nome}
        </span>

      </div>

    </button>

  )

}


export default ConsultaCard