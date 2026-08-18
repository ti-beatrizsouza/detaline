/* ========================================================= */
/* DIAS DA SEMANA                                            */
/* ========================================================= */

export function getDiasSemana() {

  return [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
  ]

}


/* ========================================================= */
/* HORÁRIOS                                                  */
/* ========================================================= */

export function getHorarios() {

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

  return horarios

}


/* ========================================================= */
/* COR DO STATUS                                             */
/* ========================================================= */

export function getCor(status) {

  switch (status) {

    case "agendado":
      return "cinza"

    case "confirmado":
      return "azul"

    case "pagou":
      return "verde"

    case "debito":
      return "rosa"

    case "pendente":
      return "rosa"

    case "faltou":
      return "amarelo"

    default:
      return "cinza"

  }

}


/* ========================================================= */
/* DATA DA SEGUNDA-FEIRA                                    */
/* ========================================================= */

export function getSegundaSemana(
  offsetSemana = 0
) {

  const hoje = new Date()

  const diaSemana =
    hoje.getDay()

  const segunda =
    new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segunda.setDate(
    hoje.getDate() +
    ajuste +
    (offsetSemana * 7)
  )

  segunda.setHours(
    0,
    0,
    0,
    0
  )

  return segunda

}


/* ========================================================= */
/* DATA DE UM DIA DA SEMANA                                  */
/* ========================================================= */

export function getDataDoDia(
  index,
  offsetSemana = 0
) {

  const segunda =
    getSegundaSemana(
      offsetSemana
    )

  const data =
    new Date(segunda)

  data.setDate(
    segunda.getDate() +
    index
  )

  return data

}


/* ========================================================= */
/* DATA YYYY-MM-DD                                           */
/* ========================================================= */

export function formatarDataAgenda(
  data
) {

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


/* ========================================================= */
/* GANHO DO DIA                                              */
/* ========================================================= */

export function ganhoDoDia(
  consultas,
  data
) {

  return consultas

    .filter(
      consulta =>
        consulta.data === data &&
        consulta.status === "pagou"
    )

    .reduce(
      (total, consulta) =>
        total +
        Number(
          consulta.valorPago || 0
        ),
      0
    )

}


/* ========================================================= */
/* GANHO DA SEMANA                                           */
/* ========================================================= */

export function ganhoDaSemana(
  consultas,
  offsetSemana = 0
) {

  const segunda =
    getSegundaSemana(
      offsetSemana
    )

  const domingo =
    new Date(segunda)

  domingo.setDate(
    segunda.getDate() + 6
  )

  domingo.setHours(
    23,
    59,
    59,
    999
  )

  return consultas

    .filter(
      consulta => {

        if (
          consulta.status !==
          "pagou"
        ) {
          return false
        }

        if (!consulta.data) {
          return false
        }

        const dataConsulta =
          new Date(
            consulta.data +
            "T00:00:00"
          )

        return (
          dataConsulta >= segunda &&
          dataConsulta <= domingo
        )

      }
    )

    .reduce(
      (total, consulta) =>
        total +
        Number(
          consulta.valorPago || 0
        ),
      0
    )

}


/* ========================================================= */
/* OFFSET DE UMA DATA                                       */
/* ========================================================= */

export function getOffsetSemanaParaData(
  data
) {

  if (!data) {
    return 0
  }

  const dataSelecionada =
    new Date(
      data + "T00:00:00"
    )

  const hoje =
    new Date()

  const diaSemana =
    hoje.getDay()

  const segundaAtual =
    new Date(hoje)

  const ajuste =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  segundaAtual.setDate(
    hoje.getDate() +
    ajuste
  )

  segundaAtual.setHours(
    0,
    0,
    0,
    0
  )

  const diferenca =
    dataSelecionada.getTime() -
    segundaAtual.getTime()

  const dias =
    diferenca /
    (1000 * 60 * 60 * 24)

  return Math.floor(
    dias / 7
  )

}

/* ========================================================= */
/* DATA DA COLUNA DA AGENDA                                  */
/* ========================================================= */

export function getDataDaColuna(
  index,
  offsetSemana = 0
) {

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

  segunda.setHours(
    0,
    0,
    0,
    0
  )

  const data = new Date(segunda)

  data.setDate(
    segunda.getDate() + index
  )

  return data

}

/* ========================================================= */
/* GERAR DATA DO SLOT                                        */
/* ========================================================= */

export function gerarDataSlot(data) {

  if (!(data instanceof Date)) {
    return ""
  }

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