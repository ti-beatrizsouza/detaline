export function getCor(status) {

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

export function ganhoDoDia(consultas, data) {

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

export function ganhoDaSemana(
  consultas,
  offsetSemana
) {

  const segunda = getSegundaDaSemana(offsetSemana)

  const domingo = new Date(segunda)

  domingo.setDate(
    segunda.getDate() + 6
  )

  const dataInicio =
    gerarDataSlot(segunda)

  const dataFim =
    gerarDataSlot(domingo)

  return consultas

    .filter(c => {

      return (
        c.status === "pagou" &&
        c.data >= dataInicio &&
        c.data <= dataFim
      )

    })

    .reduce(

      (total, c) =>
        total + Number(c.valorPago || 0),

      0

    )

}

export function getSegundaDaSemana(offsetSemana = 0) {

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

  return segunda

}

export function formatarData(data) {

  return new Date(

    data + "T00:00:00"

  ).toLocaleDateString("pt-BR")

}

export function gerarDataSlot(data) {

  const ano =
    data.getFullYear()

  const mes =
    String(
      data.getMonth() + 1
    ).padStart(2, "0")

  const dia =
    String(
      data.getDate()
    ).padStart(2, "0")

  return `${ano}-${mes}-${dia}`

}

export function getDataDaColuna(index, offsetSemana = 0) {

  const segunda = getSegundaDaSemana(offsetSemana)

  const data = new Date(segunda)

  data.setDate(data.getDate() + index)

  return data

}

export function getDiasSemana() {
  return [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ]
}

export function getHorarios() {
  const horarios = []

  for (let h = 8; h <= 19; h++) {
    horarios.push(`${String(h).padStart(2, "0")}:00`)

    if (h !== 19) {
      horarios.push(`${String(h).padStart(2, "0")}:30`)
    }
  }

  return horarios
}

export function getOffsetSemanaParaData(dataString) {

  if (!dataString) {
    return 0
  }

  const dataAlvo =
    new Date(dataString + "T00:00:00")

  if (isNaN(dataAlvo.getTime())) {
    return 0
  }

  const hoje = new Date()

  const diaSemana = hoje.getDay()

  const segundaAtual = new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segundaAtual.setDate(
    hoje.getDate() + ajuste
  )

  segundaAtual.setHours(
    0, 0, 0, 0
  )

  const diferenca =
    Math.round(
      (dataAlvo - segundaAtual) /
      (1000 * 60 * 60 * 24)
    )

  return Math.floor(
    diferenca / 7
  )
}