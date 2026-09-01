function ConsultaCard({
  consulta,
  pacientes,
  setSelecionada,
  setObsEditando
}) {

  const paciente =
    pacientes.find(
      (p) =>
        p.id ===
        consulta.pacienteId
    )


  /* ========================================================= */
  /* TAG                                                       */
  /* ========================================================= */

  const tagBruta =
    paciente?.tag ??
    paciente?.tags ??
    consulta?.tag ??
    consulta?.tags ??
    ""


  const tag =
    Array.isArray(tagBruta)
      ? tagBruta[0]
      : tagBruta


  const tagFormatada =
    tag !== null &&
    tag !== undefined &&
    String(tag).trim() !== ""
      ? `#${String(tag).replace(/^#/, "")}`
      : ""


  /* ========================================================= */
  /* NOME / APELIDO                                            */
  /* ========================================================= */

  /*
   * Se o paciente tiver apelido cadastrado,
   * ele será mostrado na agenda.
   *
   * Caso contrário, continua mostrando
   * o nome normal do paciente.
   */

  const nome =
    paciente?.apelido?.trim()
      ? paciente.apelido.trim()
      : paciente?.nome ||
        consulta?.nome ||
        "Paciente"


  /* ========================================================= */
  /* RENDER                                                    */
  /* ========================================================= */

  return (

    <button
      type="button"
      className="consulta-btn"
      onClick={() => {

        setObsEditando(
          paciente?.obs || ""
        )

        setSelecionada(
          consulta
        )

      }}
    >

      <div className="consulta-info">

        {tagFormatada && (

          <span className="consulta-tag">
            {tagFormatada}
          </span>

        )}


        <span className="consulta-nome">
          {nome}
        </span>

      </div>

    </button>

  )

}


export default ConsultaCard