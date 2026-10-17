import {
  useEffect,
  useState
} from "react"

import {
  doc,
  updateDoc
} from "firebase/firestore"

import { db } from "../services/firebase"

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
  removerAgendamentosFuturos
}) {
  const [
    mostrarPagamento,
    setMostrarPagamento
  ] = useState(false)

  const [
    editandoData,
    setEditandoData
  ] = useState(false)

  const [
    editandoHora,
    setEditandoHora
  ] = useState(false)

  const [
    salvandoDataHora,
    setSalvandoDataHora
  ] = useState(false)

  const [
    confirmandoExclusaoFuturos,
    setConfirmandoExclusaoFuturos
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

  const horarios = []

  for (
    let hora = 8;
    hora <= 19;
    hora++
  ) {
    horarios.push(
      `${String(hora).padStart(2, "0")}:00`
    )

    if (hora < 19) {
      horarios.push(
        `${String(hora).padStart(2, "0")}:30`
      )
    }
  }

  useEffect(() => {
    setEditandoData(false)
    setEditandoHora(false)
    setConfirmandoExclusaoFuturos(false)
  }, [selecionada.id])

  function formatarData(data) {
    if (!data) {
      return "Data não informada"
    }

    const dataObj =
      new Date(data + "T00:00:00")

    if (isNaN(dataObj.getTime())) {
      return "Data não informada"
    }

    return dataObj.toLocaleDateString("pt-BR")
  }

  const proximaConsulta =
    pacienteModal?.proxConsulta || ""

  const mostrarProximaConsulta =
    Boolean(
      proximaConsulta &&
      proximaConsulta !== selecionada.data
    )

  function descobrirDiaSemana(data) {
    if (!data) {
      return ""
    }

    const dataObj =
      new Date(`${data}T00:00:00`)

    if (Number.isNaN(dataObj.getTime())) {
      return ""
    }

    const diasSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado"
    ]

    return diasSemana[dataObj.getDay()] || ""
  }

  async function alterarDataHora(novaData, novaHora) {
    if (
      !selecionada?.id ||
      !novaData ||
      !novaHora
    ) {
      return
    }

    const dia = descobrirDiaSemana(novaData)

    if (!dia) {
      return
    }

    try {
      setSalvandoDataHora(true)

      await updateDoc(
        doc(db, "agenda", selecionada.id),
        {
          data: novaData,
          hora: novaHora,
          dia
        }
      )

      if (
        pacienteModal?.id &&
        pacienteModal?.proxConsulta === selecionada.data
      ) {
        await updateDoc(
          doc(db, "pacientes", pacienteModal.id),
          {
            proxConsulta: novaData
          }
        )
      }

      setSelecionada({
        ...selecionada,
        data: novaData,
        hora: novaHora,
        dia
      })

      setEditandoData(false)
      setEditandoHora(false)
    } catch (erro) {
      console.error(
        "Erro ao alterar data/horário:",
        erro
      )

      alert(
        "Não foi possível alterar a data ou o horário."
      )
    } finally {
      setSalvandoDataHora(false)
    }
  }

  async function alterarData(novaData) {
    await alterarDataHora(
      novaData,
      selecionada.hora || "08:00"
    )
  }

  async function alterarHora(novaHora) {
    await alterarDataHora(
      selecionada.data,
      novaHora
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

  async function alterarStatusEFechar(status) {
    await mudarStatus(status)
    fecharModal()
  }

  function verPerfil() {
    const paciente =
      pacientes.find(
        (p) => p.id === selecionada.pacienteId
      )

    if (paciente) {
      abrirPerfil(paciente, "agenda")
    }
  }

  const nomePaciente =
    pacienteModal?.nome ||
    selecionada.nome ||
    "Paciente"

  const telefonePaciente =
    pacienteModal?.tel ||
    pacienteModal?.telefone ||
    selecionada.tel ||
    selecionada.telefone ||
    ""

  const telefoneResponsavel =
    pacienteModal?.telefoneResponsavel ||
    pacienteModal?.telResponsavel ||
    pacienteModal?.telefoneResponsavelLegal ||
    pacienteModal?.telefoneResp ||
    pacienteModal?.telResp ||
    pacienteModal?.responsavelTelefone ||
    pacienteModal?.telefone_do_responsavel ||
    ""

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
        <div className="modal-box modal-box-principal">
          <div className="modal-paciente-cabecalho">
            <h2>Paciente Agendado</h2>

            <div className="modal-paciente-nome-linha">
              <h3>{nomePaciente}</h3>
            </div>

            {tagFormatada && (
              <div className="modal-paciente-tag-linha">
                <span className="modal-paciente-tag">
                  {tagFormatada}
                </span>
              </div>
            )}

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

          <div className="modal-consulta-info-area">
            <div className="modal-consulta-info">
              <p>
                <span className="modal-info-icone">
                  📅
                </span>

                {editandoData ? (
                  <input
                    className="modal-data-input"
                    type="date"
                    value={selecionada.data || ""}
                    disabled={salvandoDataHora}
                    autoFocus
                    onChange={(e) =>
                      alterarData(e.target.value)
                    }
                    onBlur={() =>
                      setEditandoData(false)
                    }
                  />
                ) : (
                  <button
                    type="button"
                    className="modal-info-editavel"
                    onClick={() => setEditandoData(true)}
                    disabled={salvandoDataHora}
                    title="Clique para alterar a data"
                  >
                    <strong>
                      {selecionada.dia || "Dia não informado"}
                    </strong>

                    <span>•</span>

                    <span>
                      {formatarData(selecionada.data)}
                    </span>
                  </button>
                )}
              </p>

              <p>
                <span className="modal-info-icone">
                  ⏰
                </span>

                {editandoHora ? (
                  <select
                    className="modal-hora-select"
                    value={selecionada.hora || "08:00"}
                    disabled={salvandoDataHora}
                    autoFocus
                    onChange={(e) =>
                      alterarHora(e.target.value)
                    }
                    onBlur={() =>
                      setEditandoHora(false)
                    }
                  >
                    {horarios.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    type="button"
                    className="modal-info-editavel"
                    onClick={() => setEditandoHora(true)}
                    disabled={salvandoDataHora}
                    title="Clique para alterar o horário"
                  >
                    <span>
                      {selecionada.hora || "Horário não informado"}
                    </span>
                  </button>
                )}
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
                    {Number(selecionada.valorPago)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </p>
              )}
            </div>

            <div className="modal-proxima-consulta">
              <span className="modal-proxima-label">
                PRÓXIMA CONSULTA
              </span>

              <strong>
                {mostrarProximaConsulta
                  ? formatarData(proximaConsulta)
                  : "Não agendada"}
              </strong>
            </div>
          </div>

          <div className="modal-observacao">
            <label>Observações</label>

            <textarea
              className="valor-input"
              rows="4"
              placeholder="Observações da consulta..."
              value={obsEditando}
              onChange={(e) =>
                setObsEditando(e.target.value)
              }
              onBlur={() => {
                if (typeof salvarObs === "function") {
                  salvarObs()
                }
              }}
            />
          </div>

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
                alterarStatusEFechar("confirmado")
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
              className="btn-checkup"
              onClick={() =>
                alterarStatusEFechar("checkup")
              }
            >
              Check-up
            </button>

            <button
              type="button"
              className="btn-debito"
              onClick={() =>
                alterarStatusEFechar("pendente")
              }
            >
              Pagamento Pendente
            </button>

            <button
              type="button"
              className="btn-faltou"
              onClick={() =>
                alterarStatusEFechar("faltou")
              }
            >
              Faltou
            </button>

            <button
              type="button"
              className="btn-agendado"
              onClick={() =>
                alterarStatusEFechar("agendado")
              }
            >
              Agendado
            </button>

            {Number(selecionada.valorPago) > 0 && (
              <button
                type="button"
                className="remover-valor-btn"
                onClick={removerValor}
              >
                Remover Valor
              </button>
            )}

            {selecionada.serieReagendamentoId && (
              <div className="excluir-futuros-box">
                {!confirmandoExclusaoFuturos ? (
                  <button
                    type="button"
                    className="remover-futuros-btn"
                    onClick={() =>
                      setConfirmandoExclusaoFuturos(true)
                    }
                  >
                    Excluir próximos agendamentos
                  </button>
                ) : (
                  <div className="confirmar-exclusao-futuros">
                    <span>
                      Excluir todas as consultas futuras desta sequência?
                    </span>

                    <div>
                      <button
                        type="button"
                        className="confirmar-remover-futuros-btn"
                        onClick={async () => {
                          try {
                            const quantidade =
                              await removerAgendamentosFuturos()

                            setConfirmandoExclusaoFuturos(false)

                            alert(
                              quantidade > 0
                                ? `${quantidade} consulta(s) futura(s) excluída(s).`
                                : "Não havia consultas futuras para excluir."
                            )
                          } catch (erro) {
                            console.error(
                              "Erro ao excluir consultas futuras:",
                              erro
                            )

                            alert(
                              "Não foi possível excluir as consultas futuras."
                            )
                          }
                        }}
                      >
                        Sim, excluir
                      </button>

                      <button
                        type="button"
                        className="cancelar-remover-futuros-btn"
                        onClick={() =>
                          setConfirmandoExclusaoFuturos(false)
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

        {mostrarPagamento && (
          <div className="pagamento-box">
            <h3>Registrar Pagamento</h3>

            <label>Forma de pagamento</label>

            <select
              value={formaPagamento}
              onChange={(e) =>
                setFormaPagamento(e.target.value)
              }
            >
              <option value="">Selecione...</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Débito">
                Cartão de Débito
              </option>
              <option value="Cartão de Crédito">
                Cartão de Crédito
              </option>
            </select>

            <label>Valor pago</label>

            <input
              className="valor-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$ 0,00"
              value={valorPago}
              onChange={(e) =>
                setValorPago(e.target.value)
              }
            />

            <button
              type="button"
              className="enviar-valor-btn"
              onClick={confirmarPagamento}
            >
              💰 Confirmar Pagamento
            </button>

            <button
              type="button"
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