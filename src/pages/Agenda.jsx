import { useEffect, useState } from "react"

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  addDoc
} from "firebase/firestore"

import { db } from "../services/firebase"

import "../styles/agenda.css"

function Agenda({ voltar, abrirPerfil, abrirCadastroDentista}) {

  const [consultas, setConsultas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [selecionada, setSelecionada] = useState(null)
  const [valorPago, setValorPago] = useState("")
  const [novoAgendamento, setNovoAgendamento] =
  useState(null)
  const [buscaPaciente, setBuscaPaciente] = useState("")
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [dataConsulta, setDataConsulta] = useState("")
  const [pacienteTopo, setPacienteTopo] = useState("")
  const [diaTopo, setDiaTopo] = useState(
  new Date()
    .toISOString()
    .split("T")[0]
)
  const [horaTopo, setHoraTopo] = useState("07:00")
  const [statusTopo, setStatusTopo] = useState("agendado")
  const [offsetSemana, setOffsetSemana] = useState(0)
  const [obsEditando, setObsEditando] =
  useState("")
  const [formaPagamento, setFormaPagamento] =
  useState("")

  const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ]

  const horarios = []

  for (let h = 7; h <= 20; h++) {

    horarios.push(
      `${String(h).padStart(2, "0")}:00`
    )

    if (h !== 20) {

      horarios.push(
        `${String(h).padStart(2, "0")}:30`
      )

    }

  }

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "agenda"),
      (snap) => {

        const lista = []

        snap.forEach((d) =>
          lista.push({
            id: d.id,
            ...d.data()
          })
        )

        setConsultas(lista)

      }
    )

    const pacienteModal =
  pacientes.find(
    p =>
      p.id ===
      selecionada?.pacienteId
  )

    return () => unsub()

  }, [])

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "pacientes"),
      (snap) => {

        const lista = []

        snap.forEach((d) =>
          lista.push({
            id: d.id,
            ...d.data()
          })
        )

        setPacientes(lista)

      }
    )

    return () => unsub()

  }, [])

  useEffect(() => {

  if (novoAgendamento?.data) {

    setDataConsulta(
      novoAgendamento.data
    )

  }

}, [novoAgendamento])

  function getCor(status) {

    switch (status) {

      case "confirmado":
        return "azul"

      case "pagou":
        return "verde"

      case "pendente":
        return "rosa"

      case "faltou":
        return "amarelo"

      default:
        return "cinza"

    }

  }

  async function mudarStatus(status) {

    if (
  status === "pagou" &&
  !formaPagamento
) {
  return
}

  await updateDoc(
  doc(
    db,
    "agenda",
    selecionada.id
  ),
  {
    status,

    valorPago:
      status === "pagou"
        ? Number(valorPago || 0)
        : selecionada.valorPago || 0,

    formaPagamento:
      status === "pagou"
        ? formaPagamento
        : selecionada.formaPagamento || ""
  }
)

  if (
    status === "pagou" &&
    valorPago &&
    selecionada.pacienteId
  ) {

    await updateDoc(
      doc(
        db,
        "pacientes",
        selecionada.pacienteId
      ),
      {
        totalPago: increment(
          Number(valorPago)
        )
      }
    )

  }

  setSelecionada({
  ...selecionada,
  status,

  valorPago:
    status === "pagou"
      ? Number(valorPago || 0)
      : selecionada.valorPago || 0,

  formaPagamento:
    status === "pagou"
      ? formaPagamento
      : selecionada.formaPagamento || ""
})

  setValorPago("")

}

async function removerValor() {

  if (
    !selecionada?.pacienteId ||
    !selecionada?.valorPago
  ) return

  await updateDoc(
    doc(
      db,
      "pacientes",
      selecionada.pacienteId
    ),
    {
      totalPago: increment(
        -Number(
          selecionada.valorPago || 0
        )
      )
    }
  )

  await updateDoc(
    doc(
      db,
      "agenda",
      selecionada.id
    ),
    {
      valorPago: 0,
      status: "confirmado",
      formaPagamento: ""
    }
  )

  setSelecionada({
  ...selecionada,
  valorPago: 0,
  status: "confirmado",
  formaPagamento: ""
})

}

  async function remover() {

    await deleteDoc(
      doc(
        db,
        "agenda",
        selecionada.id
      )
    )

    setSelecionada(null)

  }

  async function criarAgendamento() {

  if (!pacienteSelecionado) {

    alert("Selecione um paciente")
    return

  }

  await addDoc(
    collection(db, "agenda"),
    {
      pacienteId: pacienteSelecionado.id,
      nome: pacienteSelecionado.nome,
      dia: novoAgendamento.dia,
      hora: novoAgendamento.hora,
      data: dataConsulta,
      status: "agendado",
      valorPago: 0
    }
  )

  await updateDoc(
    doc(
      db,
      "pacientes",
      pacienteSelecionado.id
    ),
    {
      proxConsulta: dataConsulta
    }
  )

  setNovoAgendamento(null)
  setBuscaPaciente("")
  setPacienteSelecionado(null)
  setDataConsulta("")
}

async function agendarPeloTopo() {

  if (!pacienteTopo || !diaTopo) {

    alert("Selecione paciente e data")
    return

  }

  const paciente = pacientes.find(
    p => p.id === pacienteTopo
  )

  if (!paciente) {

    alert("Paciente não encontrado")
    return

  }

  const dataObj = new Date(diaTopo)

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ]

  await addDoc(
    collection(db, "agenda"),
    {
      pacienteId: paciente.id,
      nome: paciente.nome,
      dia: diasSemana[dataObj.getDay()],
      hora: horaTopo,
      data: diaTopo,
      status: statusTopo,
      valorPago: 0
    }
  )

  await updateDoc(
  doc(
    db,
    "pacientes",
    paciente.id
  ),
  {
    proxConsulta: diaTopo
  }
)

  setPacienteTopo("")
  setDiaTopo(
    new Date()
      .toISOString()
      .split("T")[0]
  )
  setHoraTopo("07:00")
  setStatusTopo("agendado")

}

async function salvarObs() {

  const paciente =
    pacientes.find(
      p =>
        p.id ===
        selecionada.pacienteId
    )

  if (!paciente) return

  await updateDoc(
    doc(
      db,
      "pacientes",
      paciente.id
    ),
    {
      obs: obsEditando
    }
  )

  alert(
    "Observação salva!"
  )

}

async function salvarPagamento() {

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

  await updateDoc(
    doc(
      db,
      "agenda",
      selecionada.id
    ),
    {
      status: "pagou",
      valorPago: Number(valorPago),
      formaPagamento
    }
  )

  await updateDoc(
    doc(
      db,
      "pacientes",
      selecionada.pacienteId
    ),
    {
      totalPago: increment(
        Number(valorPago)
      )
    }
  )

  setSelecionada({
    ...selecionada,
    status: "pagou",
    valorPago: Number(valorPago),
    formaPagamento
  })

  setValorPago("")
  setFormaPagamento("")
}

 function ganhoDoDia(data) {

  return consultas
    .filter(c =>
      c.data === data &&
      c.status === "pagou"
    )
    .reduce(
      (total, c) =>
        total + Number(c.valorPago || 0),
      0
    )

}

function ganhoDaSemana() {

  return consultas
    .filter(c => {

      const hoje = new Date()

      const diaSemana = hoje.getDay()

      const segunda = new Date(hoje)

      const ajuste =
        diaSemana === 0
          ? -6
          : 1 - diaSemana

      segunda.setDate(
        hoje.getDate() +
        ajuste +
        offsetSemana * 7
      )

      const domingo = new Date(segunda)
      domingo.setDate(
        segunda.getDate() + 6
      )

      const dataConsulta =
        new Date(c.data + "T00:00:00")

      return (
        c.status === "pagou" &&
        dataConsulta >= segunda &&
        dataConsulta <= domingo
      )

    })
    .reduce(
      (total, c) =>
        total + Number(c.valorPago || 0),
      0
    )

}

const pacienteModal = pacientes.find(
  p => p.id === selecionada?.pacienteId
)

  return (

    <div className="agenda-container">

      <div className="agenda-topo">

        <button
          className="agenda-voltar"
          onClick={voltar}
        >
          ← Dashboard
        </button>

        <h1>
          Agenda de Consultas
        </h1>

      </div>

      <div className="nova-consulta">

  <select
  value={pacienteTopo}
  onChange={(e) => {

    if (
      e.target.value ===
      "__novo__"
    ) {

      abrirCadastroDentista()
      return

    }

    setPacienteTopo(
      e.target.value
    )

  }}
>

  <option value="">
    Selecionar paciente
  </option>

  <option value="__novo__">
    + Cadastrar paciente
  </option>

  {pacientes.map((p) => (

    <option
      key={p.id}
      value={p.id}
    >
      {p.nome}
    </option>

  ))}

</select>

  <input
    type="date"
    value={diaTopo}
    onChange={(e) =>
      setDiaTopo(
        e.target.value
      )
    }
  />

  <select
    value={horaTopo}
    onChange={(e) =>
      setHoraTopo(
        e.target.value
      )
    }
  >

    {horarios.map((h) => (

      <option
        key={h}
        value={h}
      >
        {h}
      </option>

    ))}

  </select>

  <select
    value={statusTopo}
    onChange={(e) =>
      setStatusTopo(
        e.target.value
      )
    }
  >

    <option value="agendado">
      Agendado
    </option>

    <option value="confirmado">
      Confirmado
    </option>

    <option value="pagou">
      Pagaamento realizado
    </option>

    <option value="pendente">
  Pendente
</option>

    <option value="faltou">
      Faltou
    </option>

  </select>

  <button
    onClick={agendarPeloTopo}
  >
    Agendar
  </button>

</div>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px"
  }}
>

  <button
    onClick={() =>
      setOffsetSemana(
        offsetSemana - 1
      )
    }
    style={{
      background: "#ffffff",
      color: "#b30086",
      border: "none",
      borderRadius: "14px",
      padding: "12px 20px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.15)",
      transition: "0.2s"
    }}
  >
    ← Semana Anterior
  </button>


  <button
    onClick={() =>
      setOffsetSemana(
        offsetSemana + 1
      )
    }
    style={{
      background: "#ffffff",
      color: "#b30086",
      border: "none",
      borderRadius: "14px",
      padding: "12px 20px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.15)",
      transition: "0.2s"
    }}
  >
    Próxima Semana →
  </button>

</div>

      <div className="agenda-grid">

        <div className="agenda-header">
          Horário
        </div>

        {dias.map((dia, index) => {

  const hoje = new Date()

  const diaSemana = hoje.getDay()

  const segunda = new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segunda.setDate(
    hoje.getDate() +
    ajuste +
    (offsetSemana * 7)
  )

  const data = new Date(segunda)

  data.setDate(
    segunda.getDate() + index
  )

  const dataFormatada =
    data.toLocaleDateString(
      "pt-BR"
    )

  return (

  <div
    key={index}
    className="agenda-header"
  >

    <div>
      {dia}
    </div>

    <small>
      {dataFormatada}
    </small>

  </div>

)

})}

        {horarios.map((hora) => (

        <>

            <div
              key={`hora-${hora}`}
              className="hora-cell"
            >
              {hora}
            </div>

            {dias.map((dia, index) => {

  const hoje = new Date()

  const diaSemana = hoje.getDay()

  const segunda = new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segunda.setDate(
    hoje.getDate() +
    ajuste +
    (offsetSemana * 7)
  )

  const dataAtual =
    new Date(segunda)

  dataAtual.setDate(
    segunda.getDate() + index
  )

  const ano =
  dataAtual.getFullYear()

const mes =
  String(
    dataAtual.getMonth() + 1
  ).padStart(2, "0")

const diaMes =
  String(
    dataAtual.getDate()
  ).padStart(2, "0")

const dataSlot =
  `${ano}-${mes}-${diaMes}`

  const consulta =
  consultas.find(
    c =>
      (
        c.data === dataSlot ||
        (
          !c.data &&
          c.dia === dia
        )
      )
      &&
      c.hora === hora
  )

              return (

                <div
                  key={`${dia}-${hora}`}
                  className={`agenda-slot ${
                    consulta
                      ? getCor(
                          consulta.status
                        )
                      : ""
                  }`}
                >

                  {consulta ? (

                    <button
  className="consulta-btn"
  onClick={() => {

  const paciente =
    pacientes.find(
      p =>
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

<small>
  {
    new Date(
      consulta.data + "T00:00:00"
    ).toLocaleDateString("pt-BR")
  }
</small>

    {consulta.valorPago > 0 && (
      <small>
        R$ {consulta.valorPago}
      </small>
    )}

  </div>

</button>

                  ) : (

                    <div
                      className="slot-vazio"
                      onClick={() =>
  setNovoAgendamento({
    dia,
    hora,
    data: dataSlot
  })
}
                    >
                      +
                    </div>

                  )}

                </div>

              )

            })}

          </>

        ))}

      

{}

<div className="hora-cell ganho-label">
  Ganho
</div>

{dias.map((dia, index) => {

  const hoje = new Date()

  const diaSemana = hoje.getDay()

  const segunda = new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segunda.setDate(
    hoje.getDate() +
    ajuste +
    (offsetSemana * 7)
  )

  const dataAtual = new Date(segunda)

  dataAtual.setDate(
    segunda.getDate() + index
  )

  const dataSlot =
    `${dataAtual.getFullYear()}-${String(dataAtual.getMonth()+1).padStart(2,"0")}-${String(dataAtual.getDate()).padStart(2,"0")}`

  return (

    <div
      key={dataSlot}
      className="ganho-cell"
    >

      <strong>
        R$ {ganhoDoDia(dataSlot).toFixed(2)}
      </strong>

    </div>

  )

})}

{}

<div className="hora-cell ganho-label">
  Semana
</div>

<div
  className="ganho-semana"
  style={{
    gridColumn: "2 / span 6"
  }}
>

  <strong>
    R$ {ganhoDaSemana().toFixed(2)}
  </strong>

</div>

</div>


      {selecionada && (

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
              <p>
  📅 {selecionada.dia} • {
    new Date(
      selecionada.data + "T00:00:00"
    ).toLocaleDateString("pt-BR")
  }
</p>
            </p>

            <p>
              ⏰ {selecionada.hora}
            </p>

            {selecionada.formaPagamento && (

  <p>
    💳 {
      selecionada.formaPagamento
    }
  </p>

)}

            <textarea
  className="valor-input"
  rows="5"
  value={obsEditando}
  onChange={(e) =>
    setObsEditando(
      e.target.value
    )
  }
/>

<button
  className="salvar-obs-btn"
  onClick={salvarObs}
>
  💾 Salvar Observação
</button>


            {selecionada.status === "pagou" && (

  

  <div className="valor-box">

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
      placeholder="Valor pago hoje"
      value={valorPago}
      onChange={(e) =>
        setValorPago(
          e.target.value
        )
      }
      className="valor-input"
    />

<button
  className="enviar-valor-btn"
  onClick={salvarPagamento}
>
  Enviar Valor
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
  onClick={() =>
    setSelecionada({
      ...selecionada,
      status: "pagou"
    })
  }
>
  Pago
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

      )}

                {novoAgendamento && (

  <div className="modal-bg">

    <div className="modal-box">

      <h2>
        Novo Agendamento
      </h2>

      <p>
  📅 {novoAgendamento.dia} • {
  new Date(
    novoAgendamento.data + "T00:00:00"
  ).toLocaleDateString("pt-BR")
}
</p>

      <p>
        ⏰ {novoAgendamento.hora}
      </p>

      <input
  type="date"
  className="valor-input"
  value={
    dataConsulta ||
    novoAgendamento?.data ||
    ""
  }
  onChange={(e) =>
    setDataConsulta(
      e.target.value
    )
  }
/>

      <input
        type="text"
        className="valor-input"
        placeholder="Pesquisar paciente..."
        value={buscaPaciente}
        onChange={(e) => {

          setBuscaPaciente(
            e.target.value
          )

          setPacienteSelecionado(
            null
          )

        }}
      />

      <div className="obs-box">

        {pacientes
          .filter((p) =>
            p.nome
            ?.toLowerCase()
            .includes(
              buscaPaciente
            .trim()
            .toLowerCase()
    )
)
          .slice(0, 5)
          .map((paciente) => (

            <button
              key={paciente.id}
              className="consulta-btn"
              style={{
                width: "100%",
                marginBottom: "8px",
                background: "#b30086"
              }}
              onClick={() => {

                setPacienteSelecionado(
                  paciente
                )

                setBuscaPaciente(
                  paciente.nome
                )

              }}
            >

              {paciente.nome}

            </button>

          ))}

        {

          buscaPaciente &&
          pacientes.filter((p) =>
            p.nome
              ?.toLowerCase()
              .includes(
                buscaPaciente.toLowerCase()
              )
          ).length === 0 && (

            <div
              style={{
                textAlign: "center",
                color: "#666"
              }}
            >

              Nenhum paciente encontrado

            </div>

          )

        }

      </div>

      {

        pacienteSelecionado && (

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "12px"
            }}
          >

            Paciente:
            {" "}
            <strong>
              {
                pacienteSelecionado.nome
              }
            </strong>

          </div>

        )

      }

      <div className="modal-botoes">

        <button
          onClick={
            criarAgendamento
          }
        >
          Agendar
        </button>

        <button
          className="fechar-modal-btn"
          onClick={() => {

            setNovoAgendamento(
              null
            )

            setBuscaPaciente(
              ""
            )

            setPacienteSelecionado(
              null
            )

            setDataConsulta(
              ""
            )

          }}
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

)}

    </div>

  )

}

export default Agenda