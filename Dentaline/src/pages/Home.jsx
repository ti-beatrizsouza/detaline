import Navbar from "../components/Navbar"
import "../styles/home.css"

function Home() {
  return (
    <>
      <Navbar />

      <main className="home">

        <section className="hero">

          <div className="left-side">
            <h1>Bem-vindo!</h1>

            <p>
              Um lugar mágico para cuidar do seu sorriso.
            </p>
          </div>

          <div className="right-side">

            <button>Sou Dentista</button>

            <button>Sou Paciente</button>

            <span>Criar conta</span>

          </div>

        </section>

      </main>
    </>
  )
}

export default Home