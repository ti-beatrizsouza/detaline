import "../styles/home.css"

import logob
from "../assets/logob.png"

function Home({

  abrirLogin,
  abrirCadastro

}) {

  return (

    <main className="home-container">

      <header className="home-header">

        <img
          src={logob}
          className="home-logo-topo"
        />

        <div className="home-botoes-topo">

          <button
            onClick={abrirLogin}
          >
            Login
          </button>

          <button
            onClick={abrirCadastro}
          >
            Cadastre-se
          </button>

        </div>

      </header>

      <section className="home-hero">

        <div className="home-textos">

          <h1>
            Dentaline
          </h1>

          <p>

            Plataforma odontológica
            moderna para gestão de
            pacientes, agenda,
            evolução de tratamentos
            e acompanhamento clínico.

          </p>

          <button
            onClick={abrirLogin}
          >
            Entrar
          </button>

        </div>

      </section>

      <section className="sobre-container">

        <h2>
          Sobre a clínica
        </h2>

        <p>

          A Dentaline busca unir
          tecnologia, organização
          e cuidado humanizado
          para oferecer uma
          experiência moderna
          tanto para dentistas
          quanto para pacientes.

        </p>

      </section>

    </main>

  )

}

export default Home