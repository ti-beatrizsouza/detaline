import "../styles/dashboard.css"

function Dashboard({

  abrirAgenda,
  abrirPacientes,
  sair

}) {

  return (

    <main className="dashboard-container">

      <div className="dashboard-topo">

        <h1>
          Dashboard
        </h1>

        <button
          className="sair-btn"
          onClick={sair}
        >

          Sair

        </button>

      </div>

      <div className="dashboard-grid">

        <div

          className="dashboard-card"

          onClick={abrirAgenda}

        >

          Agenda

        </div>

        <div

          className="dashboard-card"

          onClick={abrirPacientes}

        >

          Pacientes

        </div>

        <div className="dashboard-card">

          Auxiliares

        </div>

        <div className="dashboard-card">

          Configurações

        </div>

      </div>

    </main>

  )

}

export default Dashboard