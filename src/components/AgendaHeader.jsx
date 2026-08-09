// src/components/AgendaHeader.jsx

import {
  getDataDaColuna
} from "../utils/agendaUtils"

function AgendaHeader({
  dia,
  index,
  offsetSemana
}) {

  const data = getDataDaColuna(
    index,
    offsetSemana
  )

  return (

    <div className="agenda-header">

      <div>
        {dia}
      </div>

      <small>
        {data.toLocaleDateString("pt-BR")}
      </small>

    </div>

  )

}

export default AgendaHeader