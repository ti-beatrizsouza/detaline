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

  if (!selecionada) return null

  const pacienteModal = pacientes.find(
    p => p.id === selecionada.pacienteId
  )

  function formatarData(data) {
    if (!data) {
      return "Data não informada"
    }

    const dataObj = new Date(
      data + "T00:00:00"
    )

    if (isNaN(dataObj.getTime())) {
      return "Data não informada"
    }

    return dataObj.toLocaleDateString("pt-BR")
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
      alert("Selecione a forma de pagamento")
      return
    }

    if (!valorPago) {
      alert("Informe o valor pago")
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
    const paciente = pacientes.find(
      p => p.id === selecionada.pacienteId
    )

    if (paciente) {
      abrirPerfil(paciente, "agenda")
    }
  }

  return (
    <div className="modal-bg">

      <div className="pagamento-layout">

        {/* ================================================= */}
        {/* MODAL PRINCIPAL                                  */}
        {/* ================================================= */}

        <div className="modal-box modal-box-principal">

          {/* CABEÇALHO DO PACIENTE */}

          <div className="modal-paciente-topo">

            <div className="modal-foto">

              {pacienteModal?.foto ? (

                <img
                  src={pacienteModal.foto}
                  alt={pacienteModal.nome || "Paciente"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />

              ) : (

                pacienteModal?.nome
                  ?.charAt(0)
                  ?.toUpperCase() || "?"

              )}

            </div>

            <h2>
              {selecionada.nome}
            </h2>

          </div>


          {/* ================================================= */}
          {/* INFORMAÇÕES DA CONSULTA                          */}
          {/* ================================================= */}

          <p>
            📅 {selecionada.dia || "Dia não informado"} •{" "}
            {formatarData(selecionada.data)}
          </p>

          <p>
            ⏰ {selecionada.hora || "Horário não informado"}
          </p>

          {selecionada.formaPagamento && (
            <p>
              💳 {selecionada.formaPagamento}
            </p>
          )}

          {selecionada.valorPago > 0 && (
            <p>
              💰 Valor pago: R${" "}
              {Number(selecionada.valorPago)
                .toFixed(2)
                .replace(".", ",")}
            </p>
          )}


          {/* ================================================= */}
          {/* OBSERVAÇÃO                                       */}
          {/* ================================================= */}

          <textarea
            className="valor-input"
            rows="5"
            placeholder="Observações da consulta..."
            value={obsEditando}
            onChange={e =>
              setObsEditando(e.target.value)
            }
          />

          <button
            className="salvar-obs-btn"
            onClick={salvarObs}
          >
            💾 Salvar Observação
          </button>


          {/* ================================================= */}
          {/* BOTÕES                                           */}
          {/* ================================================= */}

          <div className="modal-botoes">

            {/* PERFIL */}

            <button
              onClick={verPerfil}
            >
              Ver Perfil
            </button>


            {/* CONFIRMADO */}

            <button
              className="btn-confirmado"
              onClick={() =>
                mudarStatus("confirmado")
              }
            >
              Confirmado
            </button>


            {/* PAGO */}

            <button
              className="btn-pago"
              onClick={abrirPagamento}
            >
              Pago
            </button>


            {/* PENDENTE */}

            <button
              className="btn-debito"
              onClick={() =>
                mudarStatus("pendente")
              }
            >
              Pagamento Pendente
            </button>


            {/* FALTOU */}

            <button
              className="btn-faltou"
              onClick={() =>
                mudarStatus("faltou")
              }
            >
              Faltou
            </button>


            {/* AGENDADO */}

            <button
              className="btn-agendado"
              onClick={() =>
                mudarStatus("agendado")
              }
            >
              Agendado
            </button>


            {/* REMOVER VALOR */}

            {Number(selecionada.valorPago) > 0 && (

              <button
                className="remover-valor-btn"
                onClick={removerValor}
              >
                Remover Valor
              </button>

            )}


            {/* REMOVER CONSULTA */}

            <button
              className="remover-btn"
              onClick={remover}
            >
              Remover
            </button>


            {/* FECHAR */}

            <button
              className="fechar-modal-btn"
              onClick={fecharModal}
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
              💳 Registrar Pagamento
            </h3>


            {/* FORMA DE PAGAMENTO */}

            <label>
              Forma de pagamento
            </label>

            <select
              value={formaPagamento}
              onChange={e =>
                setFormaPagamento(e.target.value)
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
              value={valorPago}
              onChange={e =>
                setValorPago(e.target.value)
              }
            />


            {/* CONFIRMAR */}

            <button
              className="enviar-valor-btn"
              onClick={confirmarPagamento}
            >
              💰 Confirmar Pagamento
            </button>


            {/* CANCELAR */}

            <button
              className="cancelar-pagamento-btn"
              onClick={cancelarPagamento}
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