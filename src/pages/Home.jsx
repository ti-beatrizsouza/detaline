import "../styles/home.css"

import logob from "../assets/logob.png"
import fotoAlineCaindo from "../assets/alinecaindo.jpg"
import fotoAlineCadeira from "../assets/alinecadeira.jpeg"
import fotoAlineConsultorio from "../assets/alineconsultorio.jpeg"
import fotoAlineLivro from "../assets/alinelivro.jpeg"
import cartas from "../assets/cartas.png"
import xicaraRosa from "../assets/xicarar.png"
import xicaraBranca from "../assets/xicarab.png"
import chapeu from "../assets/chapeu.png"
import pocao from "../assets/pocao.png"

function Home({
  abrirLogin,
  abrirCadastro
}) {
  return (
    <main className="home-container">

      <header className="home-header">
        <div className="home-acoes-topo">
          <button
            type="button"
            className="home-login-btn"
            onClick={abrirLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="home-cadastro-btn"
            onClick={abrirCadastro}
          >
            Cadastre-se
          </button>
        </div>

        <div className="home-marca">
          <div className="home-titulo-marca">
            <span>ODONTOLOGIA INFANTIL</span>
            <h1>Dentaline Wonderland</h1>
            <p>Um consultório mágico</p>
          </div>

          <img
            src={logob}
            className="home-logo-topo"
            alt="Dentaline Wonderland"
          />
        </div>
      </header>

      <section
        className="home-hero"
        id="inicio"
      >
        <div className="home-textos">
          <span className="home-selo">
            Bem-vindos à Wonderland
          </span>

          <h2>
            Um consultório
            <br />
            <span>mágico</span>
          </h2>

          <p>
            A Dentaline Wonderland une cuidado odontológico,
            acolhimento e imaginação para tornar cada visita
            mais especial para crianças e famílias.
          </p>

          <button
            type="button"
            className="home-entrar-btn"
            onClick={abrirLogin}
          >
            Entrar na plataforma
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="home-visual">
          <div className="home-foto-stage">
            <img
              src={fotoAlineCaindo}
              className="home-foto-doutora"
              alt="Dra. Aline em uma cena inspirada no País das Maravilhas"
            />

            <div className="home-foto-sombra" />

            <img
              src={cartas}
              className="home-objeto-caindo home-cartas home-objeto-um"
              alt=""
              aria-hidden="true"
            />

            <img
              src={xicaraRosa}
              className="home-objeto-caindo home-xicara home-objeto-dois"
              alt=""
              aria-hidden="true"
            />

            <img
              src={chapeu}
              className="home-objeto-caindo home-chapeu home-objeto-tres"
              alt=""
              aria-hidden="true"
            />

            <img
              src={pocao}
              className="home-objeto-caindo home-pocao home-objeto-quatro"
              alt=""
              aria-hidden="true"
            />

            <img
              src={xicaraBranca}
              className="home-objeto-caindo home-xicara home-objeto-cinco"
              alt=""
              aria-hidden="true"
            />

            <img
              src={cartas}
              className="home-objeto-caindo home-cartas home-objeto-seis"
              alt=""
              aria-hidden="true"
            />

            <div className="home-foto-legenda">
              <span className="home-foto-legenda-ponto" />
              <span>Dra. Aline • Dentaline Wonderland</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-apresentacao"
        id="doutora"
      >
        <div className="home-apresentacao-topo">
          <div className="home-apresentacao-texto">
            <span className="home-secao-selo">
              Conheça a doutora
            </span>

            <h2>
              Dra. Aline
              <span> Medeiros</span>
            </h2>

            <p>
              À frente da Dentaline Wonderland, a Dra. Aline
              une cuidado e imaginação para tornar a experiência
              odontológica mais acolhedora para crianças e famílias.
            </p>

            <p>
              Com atenção a cada paciente, ela transforma o
              consultório em um espaço lúdico, onde confiança,
              carinho e cuidado fazem parte de cada visita.
            </p>

            <div className="home-contatos">
              <div className="home-contato-item">
                <span className="home-contato-icone" aria-hidden="true">
                  ☎
                </span>

                <div>
                  <span className="home-contato-label">
                    Agende ou fale com a clínica
                  </span>

                  <a
                    href="https://wa.me/559288338981"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +55 (92) 8833-8981
                  </a>
                </div>
              </div>

              <div className="home-contato-item">
                <span className="home-contato-icone" aria-hidden="true">
                  ⌖
                </span>

                <div>
                  <span className="home-contato-label">
                    Local de atendimento
                  </span>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Edif%C3%ADcio%20Atlantic%20Tower%2C%20Av.%20Djalma%20Batista%2C%201719%2C%20Chapada%2C%20Manaus%20-%20AM%2C%2069050-010"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edif. Atlantic Tower, Av. Djalma Batista, 1719
                    <br />
                    Chapada, Manaus - AM, 69050-010
                    <br />
                    Consultório 903
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="home-apresentacao-destaque">
            <span className="home-destaque-icone">✦</span>
            <strong>Um cuidado pensado para cada criança</strong>
            <span>
              Acolhimento, imaginação e atenção em cada consulta.
            </span>
          </div>
        </div>

        <div className="home-galeria">
          <figure className="home-foto-apresentacao home-foto-cadeira">
            <img
              src={fotoAlineCadeira}
              alt="Dra. Aline atendendo uma criança"
              loading="lazy"
            />
            <figcaption>
              Cuidado de perto
            </figcaption>
          </figure>

          <figure className="home-foto-apresentacao">
            <img
              src={fotoAlineConsultorio}
              alt="Dra. Aline no consultório"
              loading="lazy"
            />
            <figcaption>
              Um espaço para acolher
            </figcaption>
          </figure>

          <figure className="home-foto-apresentacao">
            <img
              src={fotoAlineLivro}
              alt="Dra. Aline lendo com uma criança"
              loading="lazy"
            />
            <figcaption>
              Histórias e sorrisos
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="home-destaques">
        <article className="home-destaque">
          <span className="home-destaque-icone">♡</span>
          <div>
            <h3>Acolhimento</h3>
            <p>
              Atenção ao tempo e às necessidades de cada criança.
            </p>
          </div>
        </article>

        <article className="home-destaque">
          <span className="home-destaque-icone">✧</span>
          <div>
            <h3>Imaginação</h3>
            <p>
              Um universo lúdico que deixa a visita mais leve.
            </p>
          </div>
        </article>

        <article className="home-destaque">
          <span className="home-destaque-icone">✦</span>
          <div>
            <h3>Cuidado em família</h3>
            <p>
              Crianças e responsáveis recebidos com carinho.
            </p>
          </div>
        </article>
      </section>

      <footer className="home-footer">
        <span>Dentaline Wonderland</span>
        <span>Um consultório mágico</span>
      </footer>

    </main>
  )
}

export default Home