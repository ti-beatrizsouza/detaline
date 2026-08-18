import "../styles/dashboard.css"

import logob from "../assets/logob.png"
import relogiobolso from "../assets/relogiobolso.png"
import cartas from "../assets/cartas.png"
import xicarar from "../assets/xicarar.png"
import xadrezr from "../assets/xadrezr.png"


function Dashboard({

  voltarHome,
  abrirAgenda,
  abrirPacientes,
  abrirFinanceiro,
  sair

}) {

  return (

    <main className="dashboard-container">


      {/* ================================================= */}
      {/* DECORAÇÕES WONDERLAND                            */}
      {/* ================================================= */}

      <img
        src={relogiobolso}
        className="
          wonderland-decoracao
          decor-relogio
        "
        alt=""
      />

      <img
        src={cartas}
        className="
          wonderland-decoracao
          decor-cartas
        "
        alt=""
      />

      <img
        src={xicarar}
        className="
          wonderland-decoracao
          decor-xicara
        "
        alt=""
      />

      <img
        src={xadrezr}
        className="
          wonderland-decoracao
          decor-xadrez
        "
        alt=""
      />


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <header className="dashboard-topo">


        {/* ================================================= */}
        {/* VOLTAR PARA HOME                                  */}
        {/* ================================================= */}

        <button
          type="button"
          className="dashboard-voltar"
          onClick={voltarHome}
        >

          ← Voltar para Home

        </button>


        {/* ================================================= */}
        {/* LADO DIREITO                                      */}
        {/* ================================================= */}

        <div className="dashboard-topo-direita">


          {/* ================================================= */}
          {/* ADMINISTRADOR                                     */}
          {/* ================================================= */}

          <div className="dashboard-usuario">

            <div className="dashboard-usuario-icone">
              D
            </div>

            <div className="dashboard-usuario-info">

              <span>
                Administrador
              </span>

              <small>
                Painel administrativo
              </small>

            </div>

          </div>


          {/* ================================================= */}
          {/* SAIR                                              */}
          {/* ================================================= */}

          <button
            type="button"
            className="sair-btn"
            onClick={sair}
          >

            Sair

          </button>


          {/* ================================================= */}
          {/* LOGO — ÚLTIMO ELEMENTO DA DIREITA                */}
          {/* ================================================= */}

          <div className="dashboard-marca">

            <img
              src={logob}
              className="dashboard-logo"
              alt="Dentaline"
            />

          </div>


        </div>

      </header>


      {/* ================================================= */}
      {/* CONTEÚDO                                          */}
      {/* ================================================= */}

      <section className="dashboard-conteudo">


        {/* ================================================= */}
        {/* BOAS-VINDAS                                      */}
        {/* ================================================= */}

        <div className="dashboard-boas-vindas">

          <span className="dashboard-eyebrow">

            BEM-VINDA AO DENTALINE

          </span>


          <h1>

            Painel de controle

          </h1>


          <p>

            Tudo o que você precisa para cuidar
            da sua clínica, em um só lugar.

          </p>

        </div>


        {/* ================================================= */}
        {/* CARDS                                             */}
        {/* ================================================= */}

        <div className="dashboard-grid">


          {/* ================================================= */}
          {/* AGENDA                                            */}
          {/* ================================================= */}

          <button
            type="button"
            className="
              dashboard-card
              dashboard-card-agenda
            "
            onClick={abrirAgenda}
          >

            <div className="dashboard-card-icone">
              📅
            </div>


            <div className="dashboard-card-conteudo">

              <span className="dashboard-card-label">
                ORGANIZAÇÃO
              </span>

              <h2>
                Agenda
              </h2>

              <p>
                Organize consultas, horários,
                confirmações e pagamentos dos pacientes.
              </p>

            </div>


            <span className="dashboard-card-seta">
              →
            </span>

          </button>


          {/* ================================================= */}
          {/* PACIENTES                                         */}
          {/* ================================================= */}

          <button
            type="button"
            className="
              dashboard-card
              dashboard-card-pacientes
            "
            onClick={abrirPacientes}
          >

            <div className="dashboard-card-icone">
              👥
            </div>


            <div className="dashboard-card-conteudo">

              <span className="dashboard-card-label">
                CADASTROS
              </span>

              <h2>
                Pacientes
              </h2>

              <p>
                Consulte perfis, informações,
                tratamentos e histórico dos pacientes.
              </p>

            </div>


            <span className="dashboard-card-seta">
              →
            </span>

          </button>


          {/* ================================================= */}
          {/* FINANCEIRO                                        */}
          {/* ================================================= */}

          <button
            type="button"
            className="
              dashboard-card
              dashboard-card-financeiro
            "
            onClick={abrirFinanceiro}
          >

            <div className="dashboard-card-icone">
              💰
            </div>


            <div className="dashboard-card-conteudo">

              <span className="dashboard-card-label">
                CONTROLE
              </span>

              <h2>
                Financeiro
              </h2>

              <p>
                Acompanhe os ganhos da clínica,
                pagamentos e movimentações financeiras.
              </p>

            </div>


            <span className="dashboard-card-seta">
              →
            </span>

          </button>


          {/* ================================================= */}
          {/* CONFIGURAÇÕES                                     */}
          {/* ================================================= */}

          <button
            type="button"
            className="
              dashboard-card
              dashboard-card-configuracoes
            "
          >

            <div className="dashboard-card-icone">
              ⚙️
            </div>


            <div className="dashboard-card-conteudo">

              <span className="dashboard-card-label">
                SISTEMA
              </span>

              <h2>
                Configurações
              </h2>

              <p>
                Gerencie as preferências e configurações
                do sistema Dentaline.
              </p>

            </div>


            <span className="dashboard-card-seta">
              →
            </span>

          </button>


        </div>

      </section>


      {/* ================================================= */}
      {/* RODAPÉ                                            */}
      {/* ================================================= */}

      <footer className="dashboard-footer">

        <span>
          Dentaline
        </span>

        <span>
          Gestão odontológica
        </span>

      </footer>


    </main>

  )

}


export default Dashboard