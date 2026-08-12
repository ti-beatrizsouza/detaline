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
}) {

  const [mostrarPagamento, setMostrarPagamento] =
    useState(false)

  if (!selecionada) return null

  const pacienteModal =
    pacientes.find(
      p =>
        p.id === selecionada.pacienteId
    )

  function formatarData(data) {

    if (!data) {
      return "Data não informada"
    }

    const dataObj =
      new Date(data + "T00:00:00")

    if (isNaN(dataObj.getTime())) {
      return "Data não informada"
    }

    return dataObj.toLocaleDateString(
      "pt-BR"
    )
  }

  function abrirPagamento() {

    setMostrarPagamento(true)

  }

  function cancelarPagamento() {

    setMostrarPagamento(false)
    setFormaPagamento("")
    setValorPago("")

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

  }

  return (

    <div className="modal-bg">

      <div className="modal-box">

        <div className="modal-paciente-topo">

          <div className="modal-foto">

            {pacienteModal?.foto ? (

              <img
                src={pacienteModal.foto}
                alt={pacienteModal.nome}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%"
                }}
              />

            ) : (

              pacienteModal?.nome
                ?.charAt(0)
                ?.toUpperCase()

            )}

          </div>

          <h2>
            {selecionada.nome}
          </h2>

        </div>

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

        <textarea
          className="valor-input"
          rows="5"
          value={obsEditando}
          onChange={(e) =>
            setObsEditando(e.target.value)
          }
        />

        <button
          className="salvar-obs-btn"
          onClick={salvarObs}
        >
          💾 Salvar Observação
        </button>

        {mostrarPagamento && (

          <div className="pagamento-box">

            <select
              className="valor-input"
              value={formaPagamento}
              onChange={(e) =>
                setFormaPagamento(
                  e.target.value
                )
              }
            >

              <option value="">
                Forma de pagamento
              </option>

              <option value="pix">
                PIX
              </option>

              <option value="dinheiro">
                Dinheiro
              </option>

              <option value="debito">
                Débito
              </option>

              <option value="credito">
                Crédito
              </option>

            </select>

            <input
              type="number"
              className="valor-input"
              placeholder="Valor pago hoje"
              value={valorPago}
              onChange={(e) =>
                setValorPago(
                  e.target.value
                )
              }
            />

            <button
              className="enviar-valor-btn"
              onClick={confirmarPagamento}
            >
              Salvar Pagamento
            </button>

            <button
              className="cancelar-pagamento-btn"
              onClick={cancelarPagamento}
            >
              Cancelar
            </button>

          </div>

        )}

        <div className="modal-botoes">

          <button
            onClick={() => {

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

            }}
          >
            Ver Perfil
          </button>

          <button
            className="btn-confirmado"
            onClick={() =>
              mudarStatus("confirmado")
            }
          >
            Confirmado
          </button>

          <button
            className="btn-pago"
            onClick={abrirPagamento}
          >
            Pago
          </button>

          <button
            className="btn-debito"
            onClick={() =>
              mudarStatus("pendente")
            }
          >
            Pagamento Pendente
          </button>

          <button
            className="btn-faltou"
            onClick={() =>
              mudarStatus("faltou")
            }
          >
            Faltou
          </button>

          <button
            className="btn-agendado"
            onClick={() =>
              mudarStatus("agendado")
            }
          >
            Agendado
          </button>

          {selecionada.valorPago > 0 && (

            <button
              className="remover-valor-btn"
              onClick={removerValor}
            >
              Remover Valor
            </button>

          )}

          <button
            className="remover-btn"
            onClick={remover}
          >
            Remover
          </button>

          <button
            className="fechar-modal-btn"
            onClick={() =>
              setSelecionada(null)
            }
          >
            ✕ Fechar
          </button>

        </div>

      </div>

    </div>

  )
}

export default AgendaModal