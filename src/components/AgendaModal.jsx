// src/components/AgendaModal.jsx

import { useState } from "react"

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

  const [mostrarPagamento, setMostrarPagamento] =
    useState(false)


  if (!selecionada) {
    return null
  }


  const pacienteModal =
    pacientes.find(
      p =>
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
          {/* TÍTULO                                             */}
          {/* ================================================= */}

          <div className="modal-paciente-cabecalho">

            <h2>
              Paciente Agendado
            </h2>

            <h3>
              {pacienteModal?.nome ||
                selecionada.nome}
            </h3>

          </div>


          {/* ================================================= */}
          {/* INFORMAÇÕES DA CONSULTA                           */}
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
          {/* OBSERVAÇÃO                                        */}
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
              onChange={e =>
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
          {/* BOTÕES                                             */}
          {/* ================================================= */}

          <div className="modal-botoes">


            {/* PERFIL */}

            <button
              type="button"
              className="btn-perfil"
              onClick={verPerfil}
            >
              Ver Perfil
            </button>


            {/* CONFIRMADO */}

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


            {/* PAGO */}

            <button
              type="button"
              className="btn-pago"
              onClick={
                abrirPagamento
              }
            >
              Pago
            </button>


            {/* PENDENTE */}

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


            {/* FALTOU */}

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


            {/* AGENDADO */}

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


            {/* REMOVER VALOR */}

            {Number(
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

            )}


            {/* REMOVER CONSULTA */}

            <button
              type="button"
              className="remover-btn"
              onClick={remover}
            >
              Remover
            </button>


            {/* FECHAR */}

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
        {/* PAINEL DE PAGAMENTO                               */}
        {/* ================================================= */}

        {mostrarPagamento && (

          <div className="pagamento-box">


            <h3>
          Registrar Pagamento
            </h3>


            {/* FORMA DE PAGAMENTO */}

            <label>
              Forma de pagamento
            </label>

            <select
              value={
                formaPagamento
              }
              onChange={e =>
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


            {/* VALOR */}

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
              onChange={e =>
                setValorPago(
                  e.target.value
                )
              }
            />


            {/* CONFIRMAR */}

            <button
              type="button"
              className="enviar-valor-btn"
              onClick={
                confirmarPagamento
              }
            >
              💰 Confirmar Pagamento
            </button>


            {/* CANCELAR */}

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