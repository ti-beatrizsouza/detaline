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

      <div className="agenda-dia-semana">
        {dia}
      </div>

      <small className="agenda-data">
        {data.toLocaleDateString("pt-BR")}
      </small>

    </div>

  )
}


export default AgendaHeader