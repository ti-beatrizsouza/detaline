import "../styles/home.css"
import logo from "../assets/logo.png"

function Home() {
  return (
    <main className="home">

      <div className="overlay"></div>

      <section className="content">

        <img src={logo} alt="Dentaline Logo" className="logo" />

        <p>
          Um lugar mágico para cuidar do seu sorriso ✨
        </p>

        <div className="buttons">

          <button>Sou Dentista</button>

          <button>Sou Paciente</button>

        </div>

      </section>

    </main>
  )
}

export default Home