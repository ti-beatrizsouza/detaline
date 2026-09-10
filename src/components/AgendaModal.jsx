import {
  useEffect,
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

  parcelas,
  setParcelas,

  salvarPagamento,

  removerValor,
  mudarStatus,

  abrirPerfil,
  remover,

  setSelecionada,

  pagamentoAberto,
  setPagamentoAberto

}) {


  const [
    mostrarPagamento,
    setMostrarPagamento
  ] = useState(
    selecionada?.status === "pagou"
  )


  /* ===================================================== */
  /* ABRIR PAGAMENTO AUTOMATICAMENTE                       */
  /* ===================================================== */

  useEffect(() => {

    if (!selecionada) {
      return
    }


    if (
      selecionada.status === "pagou"
    ) {

      setMostrarPagamento(true)

      if (
        setPagamentoAberto
      ) {

        setPagamentoAberto(true)

      }

    }

  }, [
    selecionada,
    setPagamentoAberto
  ])


  if (!selecionada) {
    return null
  }


  /* ===================================================== */
  /* PACIENTE                                             */
  /* ===================================================== */

  const pacienteModal =
    pacientes.find(
      p =>
        p.id ===
        selecionada.pacienteId
    )


  /* ===================================================== */
  /* DATA                                                 */
  /* ===================================================== */

  function formatarData(
    data
  ) {

    if (!data) {
      return "Data não informada"
    }


    const dataObj =
      new Date(
        data +
        "T00:00:00"
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


  /* ===================================================== */
  /* ABRIR PAGAMENTO                                      */
  /* ===================================================== */

  function abrirPagamento() {

    /*
     * Se a consulta já possui pagamento,
     * garante que os campos estejam preenchidos.
     */

    if (
      selecionada.status === "pagou"
    ) {

      setValorPago(
        selecionada.valorPago !== undefined &&
        selecionada.valorPago !== null
          ? String(
              selecionada.valorPago
            )
          : ""
      )


      setFormaPagamento(
        selecionada.formaPagamento ||
        ""
      )


      setParcelas(
        selecionada.parcelas
          ? String(
              selecionada.parcelas
            )
          : ""
      )

    }


    setMostrarPagamento(
      true
    )


    if (
      setPagamentoAberto
    ) {

      setPagamentoAberto(
        true
      )

    }

  }


  /* ===================================================== */
  /* CANCELAR PAGAMENTO                                   */
  /* ===================================================== */

  function cancelarPagamento() {

    /*
     * Se já existe um pagamento salvo,
     * não apagamos os dados só por fechar
     * a aba.
     */

    if (
      selecionada.status !== "pagou"
    ) {

      setFormaPagamento("")
      setValorPago("")
      setParcelas("")

    }
    else {

      setValorPago(
        selecionada.valorPago !== undefined &&
        selecionada.valorPago !== null
          ? String(
              selecionada.valorPago
            )
          : ""
      )

      setFormaPagamento(
        selecionada.formaPagamento ||
        ""
      )

      setParcelas(
        selecionada.parcelas
          ? String(
              selecionada.parcelas
            )
          : ""
      )

    }


    setMostrarPagamento(
      false
    )


    if (
      setPagamentoAberto
    ) {

      setPagamentoAberto(
        false
      )

    }

  }


  /* ===================================================== */
  /* CONFIRMAR PAGAMENTO                                  */
  /* ===================================================== */

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


    if (
      formaPagamento ===
      "Crédito parcelado" &&
      !parcelas
    ) {

      alert(
        "Selecione a quantidade de parcelas"
      )

      return

    }


    await salvarPagamento()


    setMostrarPagamento(
      false
    )


    if (
      setPagamentoAberto
    ) {

      setPagamentoAberto(
        false
      )

    }

  }


  /* ===================================================== */
  /* FECHAR MODAL                                         */
  /* ===================================================== */

  function fecharModal() {

    setMostrarPagamento(
      false
    )


    if (
      setPagamentoAberto
    ) {

      setPagamentoAberto(
        false
      )

    }


    setSelecionada(
      null
    )

  }


  /* ===================================================== */
  /* VER PERFIL                                           */
  /* ===================================================== */

  function verPerfil() {

    const paciente =
      pacientes.find(
        p =>
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
  /* NOME                                                */
  /* ===================================================== */

const nomePaciente =
  pacienteModal?.nome ||
  selecionada.nome ||
  "Paciente"


  /* ===================================================== */
  /* TELEFONE DO PACIENTE                                */
  /* ===================================================== */

  const telefonePaciente =
    pacienteModal?.tel ||
    pacienteModal?.telefone ||
    selecionada.tel ||
    selecionada.telefone ||
    ""


  /* ===================================================== */
  /* TELEFONE DO RESPONSÁVEL                             */
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
  /* TAG                                                 */
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
    String(
      tagPaciente
    ).trim() !== ""
      ? `#${String(
          tagPaciente
        ).replace(
          /^#/,
          ""
        )}`
      : ""


  return (

    <div className="modal-bg">

      <div className="pagamento-layout">


        {/* ================================================= */}
        {/* MODAL PRINCIPAL                                   */}
        {/* ================================================= */}

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


            {/* TAG */}

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
                  {
                    selecionada.dia ||
                    "Dia não informado"
                  }
                </strong>

                <span>
                  •
                </span>

                <span>
                  {
                    formatarData(
                      selecionada.data
                    )
                  }
                </span>

              </p>


              <p>

                <span className="modal-info-icone">
                  ⏰
                </span>

                <span>
                  {
                    selecionada.hora ||
                    "Horário não informado"
                  }
                </span>

              </p>


              {selecionada.status === "pagou" &&
                selecionada.formaPagamento && (

                <p>

                  <span className="modal-info-icone">
                    💳
                  </span>

                  <span>
                    {selecionada.formaPagamento}

                    {
                      selecionada.formaPagamento ===
                        "Crédito parcelado" &&
                      selecionada.parcelas
                        ? ` • ${selecionada.parcelas}x`
                        : ""
                    }

                  </span>

                </p>

              )}


              {Number(
                selecionada.valorPago
              ) > 0 && (

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
            {/* TELEFONES                                       */}
            {/* ================================================= */}

            <div className="modal-telefones">


              <div className="modal-telefone-item">

                <span className="modal-telefone-label">
                  Telefone
                </span>

                <span className="modal-telefone-valor">
                  {
                    telefonePaciente ||
                    "-"
                  }
                </span>

              </div>


              <div className="modal-telefone-item">

                <span className="modal-telefone-label">
                  Telefone do responsável
                </span>

                <span className="modal-telefone-valor">
                  {
                    telefoneResponsavel ||
                    "-"
                  }
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
              value={
                obsEditando
              }

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
              onClick={
                verPerfil
              }
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
              onClick={
                abrirPagamento
              }
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


            {
              Number(
                selecionada.valorPago
              ) > 0 && (

                <button
                  type="button"
                  className="remover-valor-btn"
                  onClick={
                    removerValor
                  }
                >
                  Remover Valor
                </button>

              )
            }


            <button
              type="button"
              className="remover-btn"
              onClick={
                remover
              }
            >
              Remover
            </button>


            <button
              type="button"
              className="fechar-modal-btn"
              onClick={
                fecharModal
              }
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


            {/* ================================================= */}
            {/* FORMA DE PAGAMENTO                              */}
            {/* ================================================= */}

            <label>
              Forma de pagamento
            </label>


            <select
              value={
                formaPagamento
              }

              onChange={(e) => {

                const novaForma =
                  e.target.value

                setFormaPagamento(
                  novaForma
                )


                /*
                 * Se não for parcelado,
                 * não precisamos manter parcelas.
                 */

                if (
                  novaForma !==
                  "Crédito parcelado"
                ) {

                  setParcelas("")

                }

                /*
                 * Crédito à vista sempre
                 * representa 1 parcela.
                 */

                if (
                  novaForma ===
                  "Crédito à vista"
                ) {

                  setParcelas("1")

                }

              }}

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


              <option value="Débito">
                Débito
              </option>


              <option value="Crédito à vista">
                Crédito à vista
              </option>


              <option value="Crédito parcelado">
                Crédito parcelado
              </option>


            </select>


            {/* ================================================= */}
            {/* PARCELAS                                         */}
            {/* ================================================= */}

            {
              formaPagamento ===
              "Crédito parcelado" && (

                <>

                  <label>
                    Quantidade de parcelas
                  </label>


                  <select
                    value={
                      parcelas
                    }

                    onChange={(e) =>
                      setParcelas(
                        e.target.value
                      )
                    }

                  >

                    <option value="">
                      Selecione...
                    </option>


                    <option value="2">
                      2x
                    </option>


                    <option value="3">
                      3x
                    </option>


                    <option value="4">
                      4x
                    </option>


                    <option value="5">
                      5x
                    </option>


                    <option value="6">
                      6x
                    </option>

                  </select>

                </>

              )
            }


            {/* ================================================= */}
            {/* VALOR                                            */}
            {/* ================================================= */}

            <label>
              Valor pago
            </label>


            <input
              className="valor-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$ 0,00"
              value={
                valorPago
              }

              onChange={(e) =>
                setValorPago(
                  e.target.value
                )
              }

            />


            {/* ================================================= */}
            {/* CONFIRMAR                                        */}
            {/* ================================================= */}

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