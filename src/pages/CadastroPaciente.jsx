import "../styles/cadastroPaciente.css"

import logob from "../assets/logob.png"

function CadastroPaciente({
  voltar
}) {
  return (
    <main className="cadastro-paciente-container">

      <header className="cadastro-paciente-topo">
        <button
          type="button"
          className="cadastro-paciente-voltar"
          onClick={voltar}
        >
          <span aria-hidden="true">←</span>
          Voltar para Home
        </button>

        <div className="cadastro-paciente-marca">
          <span>Dentaline Wonderland</span>
          <img
            src={logob}
            alt="Logo Dentaline Wonderland"
          />
        </div>
      </header>

      <section className="cadastro-paciente-card">
        <div className="cadastro-paciente-icone" aria-hidden="true">
          ✦
        </div>

        <span className="cadastro-paciente-etiqueta">
          ÁREA DO PACIENTE
        </span>

        <h1>
          Cadastro de pacientes
        </h1>

        <p>
          Esta ferramenta não está disponível no momento.
        </p>

        <p className="cadastro-paciente-detalhe">
          Em breve, os pacientes poderão acessar os recursos
          que a dentista disponibilizar.
        </p>
      </section>

      <footer className="cadastro-paciente-rodape">
        <span>Dentaline Wonderland</span>
        <span>Um consultório mágico</span>
      </footer>

    </main>
  )
}

export default CadastroPaciente