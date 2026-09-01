import {
  useState
} from "react"


function AgendaModal({
  selecionada,
  pacientes,
  obsEditando,
  setObsEditando,
  salvarObs,
  formaPagamento,
  setFormaPagamento,
  valorPago,
  setValorPago,
  salvarPagamento,
  removerValor,
  mudarStatus,
  abrirPerfil,
  remover,
  setSelecionada,
  pagamentoAberto,
  setPagamentoAberto,
}) {

  const [
    mostrarPagamento,
    setMostrarPagamento
  ] = useState(false)


  if (!selecionada) {
    return null
  }


  const pacienteModal =
    pacientes.find(
      (p) =>
        p.id ===
        selecionada.pacienteId
    )


  function formatarData(data) {

    if (!data) {
      return "Data não informada"
    }


    const dataObj =
      new Date(
        data + "T00:00:00"
      )


    if (
      isNaN(
        dataObj.getTime()
      )
    ) {
      return "Data não informada"
    }


    return dataObj.toLocaleDateString(
      "pt-BR"
    )
  }


  function abrirPagamento() {

    setMostrarPagamento(true)

    if (setPagamentoAberto) {
      setPagamentoAberto(true)
    }
  }


  function cancelarPagamento() {

    setMostrarPagamento(false)

    setFormaPagamento("")
    setValorPago("")

    if (setPagamentoAberto) {
      setPagamentoAberto(false)
    }
  }


  async function confirmarPagamento() {

    if (!formaPagamento) {
      alert(
        "Selecione a forma de pagamento"
      )

      return
    }


    if (!valorPago) {
      alert(
        "Informe o valor pago"
      )

      return
    }


    await salvarPagamento()

    setMostrarPagamento(false)

    if (setPagamentoAberto) {
      setPagamentoAberto(false)
    }
  }


  function fecharModal() {

    setMostrarPagamento(false)

    if (setPagamentoAberto) {
      setPagamentoAberto(false)
    }

    setSelecionada(null)
  }


  function verPerfil() {

    const paciente =
      pacientes.find(
        (p) =>
          p.id ===
          selecionada.pacienteId
      )


    if (paciente) {

      abrirPerfil(
        paciente,
        "agenda"
      )

    }
  }


  /* ===================================================== */
  /* NOME                                                  */
  /* ===================================================== */

  const nomePaciente =
    pacienteModal?.nome ||
    selecionada.nome ||
    "Paciente"


  /* ===================================================== */
  /* TELEFONE DO PACIENTE                                  */
  /* ===================================================== */

  const telefonePaciente =
    pacienteModal?.tel ||
    pacienteModal?.telefone ||
    selecionada.tel ||
    selecionada.telefone ||
    ""


  /* ===================================================== */
  /* TELEFONE DO RESPONSÁVEL                               */
  /* ===================================================== */

  const telefoneResponsavel =
    pacienteModal?.telefoneResponsavel ||
    pacienteModal?.telResponsavel ||
    pacienteModal?.telefoneResponsavelLegal ||
    pacienteModal?.telefoneResp ||
    pacienteModal?.telResp ||
    pacienteModal?.responsavelTelefone ||
    pacienteModal?.telefone_do_responsavel ||
    ""


  /* ===================================================== */
  /* TAG                                                   */
  /* ===================================================== */

  const tagBruta =
    pacienteModal?.tag ??
    pacienteModal?.tags ??
    selecionada.tag ??
    selecionada.tags ??
    ""


  const tagPaciente =
    Array.isArray(tagBruta)
      ? tagBruta[0]
      : tagBruta


  const tagFormatada =
    tagPaciente !== null &&
    tagPaciente !== undefined &&
    String(tagPaciente).trim() !== ""
      ? `#${String(tagPaciente).replace(/^#/, "")}`
      : ""


  return (

    <div className="modal-bg">

      <div className="pagamento-layout">

        <div
          className="
            modal-box
            modal-box-principal
          "
        >

          {/* ================================================= */}
          {/* CABEÇALHO                                        */}
          {/* ================================================= */}

          <div className="modal-paciente-cabecalho">

            <h2>
              Paciente Agendado
            </h2>


            {/* NOME */}

            <div className="modal-paciente-nome-linha">

              <h3>
                {nomePaciente}
              </h3>

            </div>


            {/* TAG ENTRE NOME E DATA */}

            {tagFormatada && (

              <div className="modal-paciente-tag-linha">

                <span className="modal-paciente-tag">
                  {tagFormatada}
                </span>

              </div>

            )}


            {/* ================================================= */}
            {/* INFORMAÇÕES DA CONSULTA                         */}
            {/* ================================================= */}

            <div className="modal-consulta-info">

              <p>

                <span className="modal-info-icone">
                  📅
                </span>

                <strong>
                  {selecionada.dia ||
                    "Dia não informado"}
                </strong>

                <span>
                  •
                </span>

                <span>
                  {formatarData(
                    selecionada.data
                  )}
                </span>

              </p>


              <p>

                <span className="modal-info-icone">
                  ⏰
                </span>

                <span>
                  {selecionada.hora ||
                    "Horário não informado"}
                </span>

              </p>


              {selecionada.formaPagamento && (

                <p>

                  <span className="modal-info-icone">
                    💳
                  </span>

                  <span>
                    {selecionada.formaPagamento}
                  </span>

                </p>

              )}


              {selecionada.valorPago > 0 && (

                <p>

                  <span className="modal-info-icone">
                    💰
                  </span>

                  <span>
                    Valor pago: R${" "}

                    {Number(
                      selecionada.valorPago
                    )
                      .toFixed(2)
                      .replace(
                        ".",
                        ","
                      )}
                  </span>

                </p>

              )}

            </div>


            {/* ================================================= */}
            {/* TELEFONES                                         */}
            {/* ================================================= */}

            <div className="modal-telefones">

              <div className="modal-telefone-item">

                <span className="modal-telefone-label">
                  Telefone
                </span>

                <span className="modal-telefone-valor">
                  {telefonePaciente || "-"}
                </span>

              </div>


              <div className="modal-telefone-item">

                <span className="modal-telefone-label">
                  Telefone do responsável
                </span>

                <span className="modal-telefone-valor">
                  {telefoneResponsavel || "-"}
                </span>

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* OBSERVAÇÕES                                      */}
          {/* ================================================= */}

          <div className="modal-observacao">

            <label>
              Observações
            </label>

            <textarea
              className="valor-input"
              rows="4"
              placeholder="Observações da consulta..."
              value={obsEditando}

              onChange={(e) =>
                setObsEditando(
                  e.target.value
                )
              }

              onBlur={() => {

                if (
                  typeof salvarObs ===
                  "function"
                ) {
                  salvarObs()
                }

              }}
            />

          </div>


          {/* ================================================= */}
          {/* BOTÕES                                            */}
          {/* ================================================= */}

          <div className="modal-botoes">

            <button
              type="button"
              className="btn-perfil"
              onClick={verPerfil}
            >
              Ver Perfil
            </button>


            <button
              type="button"
              className="btn-confirmado"
              onClick={() =>
                mudarStatus(
                  "confirmado"
                )
              }
            >
              Confirmado
            </button>


            <button
              type="button"
              className="btn-pago"
              onClick={abrirPagamento}
            >
              Pago
            </button>


            <button
              type="button"
              className="btn-debito"
              onClick={() =>
                mudarStatus(
                  "pendente"
                )
              }
            >
              Pagamento Pendente
            </button>


            <button
              type="button"
              className="btn-faltou"
              onClick={() =>
                mudarStatus(
                  "faltou"
                )
              }
            >
              Faltou
            </button>


            <button
              type="button"
              className="btn-agendado"
              onClick={() =>
                mudarStatus(
                  "agendado"
                )
              }
            >
              Agendado
            </button>


            {Number(
              selecionada.valorPago
            ) > 0 && (

              <button
                type="button"
                className="remover-valor-btn"
                onClick={removerValor}
              >
                Remover Valor
              </button>

            )}


            <button
              type="button"
              className="remover-btn"
              onClick={remover}
            >
              Remover
            </button>


            <button
              type="button"
              className="fechar-modal-btn"
              onClick={fecharModal}
            >
              ✕ Fechar
            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* PAGAMENTO                                        */}
        {/* ================================================= */}

        {mostrarPagamento && (

          <div className="pagamento-box">

            <h3>
              Registrar Pagamento
            </h3>


            <label>
              Forma de pagamento
            </label>

            <select
              value={formaPagamento}

              onChange={(e) =>
                setFormaPagamento(
                  e.target.value
                )
              }
            >

              <option value="">
                Selecione...
              </option>

              <option value="Pix">
                Pix
              </option>

              <option value="Dinheiro">
                Dinheiro
              </option>

              <option value="Cartão de Débito">
                Cartão de Débito
              </option>

              <option value="Cartão de Crédito">
                Cartão de Crédito
              </option>

            </select>


            <label>
              Valor pago
            </label>

            <input
              className="valor-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$ 0,00"
              value={valorPago}

              onChange={(e) =>
                setValorPago(
                  e.target.value
                )
              }
            />


            <button
              type="button"
              className="enviar-valor-btn"
              onClick={
                confirmarPagamento
              }
            >
              💰 Confirmar Pagamento
            </button>


            <button
              type="button"
              className="cancelar-pagamento-btn"
              onClick={
                cancelarPagamento
              }
            >
              Cancelar
            </button>

          </div>

        )}

      </div>

    </div>
  )
}

export default AgendaModal