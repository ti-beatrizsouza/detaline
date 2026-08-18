import { useState, useEffect } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import CadastroPaciente from "./pages/CadastroPaciente"
import CadastroDentista from "./pages/CadastroDentista"
import Dashboard from "./pages/Dashboard"
import Agenda from "./pages/Agenda"
import Pacientes from "./pages/ListaPacientes"
import PerfilPaciente from "./pages/PerfilPaciente"
import Financeiro from "./pages/Financeiro"

import useConsultas from "./hooks/useConsultas"


function App() {

  /* ===================================================== */
  /* CONSULTAS                                             */
  /* ===================================================== */

  const consultas = useConsultas()


  /* ===================================================== */
  /* PÁGINA ATUAL                                          */
  /* ===================================================== */

  const [pagina, setPagina] = useState(() => {

    const paginaSalva =
      localStorage.getItem("pagina")

    return paginaSalva || "home"

  })


  /* ===================================================== */
  /* ÚLTIMA PÁGINA                                         */
  /* ===================================================== */

  const [
    ultimaPagina,
    setUltimaPagina
  ] = useState(() =>

    localStorage.getItem(
      "ultimaPagina"
    ) || "pacientes"

  )


  /* ===================================================== */
  /* PACIENTE SELECIONADO                                  */
  /* ===================================================== */

  const [
    pacienteSelecionado,
    setPacienteSelecionado
  ] = useState(() => {

    const salvo =
      localStorage.getItem(
        "pacienteSelecionado"
      )

    return salvo
      ? JSON.parse(salvo)
      : null

  })


  /* ===================================================== */
  /* PÁGINA ANTERIOR                                       */
  /* ===================================================== */

  const [
    paginaAnterior,
    setPaginaAnterior
  ] = useState(() =>

    localStorage.getItem(
      "paginaAnterior"
    ) || "pacientes"

  )


  /* ===================================================== */
  /* AGENDAMENTO PENDENTE                                  */
  /* ===================================================== */

  const [
    agendamentoPendente,
    setAgendamentoPendente
  ] = useState(null)


  /* ===================================================== */
  /* RETORNO DO CADASTRO                                   */
  /* ===================================================== */

  const [
    retornoAgendamento,
    setRetornoAgendamento
  ] = useState(null)


  /* ===================================================== */
  /* SALVAR PÁGINA                                         */
  /* ===================================================== */

  useEffect(() => {

    localStorage.setItem(
      "paginaAtual",
      pagina
    )

  }, [pagina])


  useEffect(() => {

    localStorage.setItem(
      "pagina",
      pagina
    )

  }, [pagina])


  /* ===================================================== */
  /* VERIFICAR LOGIN                                       */
  /* ===================================================== */

  useEffect(() => {

    const logado =
      localStorage.getItem("logado")

    if (
      logado === "true" &&
      pagina === "home"
    ) {

      setPagina("dashboard")

    }

  }, [])


  /* ===================================================== */
  /* SALVAR PACIENTE                                       */
  /* ===================================================== */

  useEffect(() => {

    localStorage.setItem(
      "pacienteSelecionado",
      JSON.stringify(
        pacienteSelecionado
      )
    )

  }, [pacienteSelecionado])


  /* ===================================================== */
  /* SALVAR ÚLTIMA PÁGINA                                  */
  /* ===================================================== */

  useEffect(() => {

    localStorage.setItem(
      "ultimaPagina",
      ultimaPagina
    )

  }, [ultimaPagina])


  /* ===================================================== */
  /* SALVAR PÁGINA ANTERIOR                                */
  /* ===================================================== */

  useEffect(() => {

    localStorage.setItem(
      "paginaAnterior",
      paginaAnterior
    )

  }, [paginaAnterior])


  /* ===================================================== */
  /* ABRIR PERFIL                                          */
  /* ===================================================== */

  function abrirPerfil(
    paciente,
    origem
  ) {

    setPacienteSelecionado(
      paciente
    )

    setPaginaAnterior(
      origem
    )

    setPagina("perfil")

  }


  /* ===================================================== */
  /* ABRIR CADASTRO DA DENTISTA                            */
  /* ===================================================== */

  function abrirCadastroDentista(
    origem,
    contexto = null
  ) {

    setUltimaPagina(
      origem
    )


    /*
      Se o cadastro foi aberto a partir
      de um novo agendamento, guardamos
      o horário original.
    */

    if (
      contexto?.novoAgendamento
    ) {

      setAgendamentoPendente(
        contexto.novoAgendamento
      )

    } else {

      setAgendamentoPendente(
        null
      )

    }


    setPagina(
      "cadastroDentista"
    )

  }


  /* ===================================================== */
  /* PACIENTE CADASTRADO DURANTE AGENDAMENTO               */
  /* ===================================================== */

  function pacienteCadastrado(
    paciente
  ) {

    if (
      agendamentoPendente
    ) {

      setRetornoAgendamento({

        novoAgendamento:
          agendamentoPendente,

        paciente

      })

    }


    setAgendamentoPendente(
      null
    )

  }


  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <>


      {/* ================================================= */}
      {/* HOME                                              */}
      {/* ================================================= */}

      {
        pagina === "home" && (

          <Home

            abrirLogin={() =>
              setPagina("login")
            }

            abrirCadastro={() =>
              setPagina(
                "cadastroPaciente"
              )
            }

          />

        )
      }


      {/* ================================================= */}
      {/* LOGIN                                             */}
      {/* ================================================= */}

      {
        pagina === "login" && (

          <Login

            voltar={() =>
              setPagina("home")
            }

            entrar={() => {

              localStorage.setItem(
                "logado",
                "true"
              )

              setPagina(
                "dashboard"
              )

            }}

          />

        )
      }


      {/* ================================================= */}
      {/* CADASTRO PACIENTE                                  */}
      {/* ================================================= */}

      {
        pagina ===
          "cadastroPaciente" && (

          <CadastroPaciente

            voltar={() =>
              setPagina("home")
            }

          />

        )
      }


      {/* ================================================= */}
      {/* CADASTRO DA DENTISTA                              */}
      {/* ================================================= */}

      {
        pagina ===
          "cadastroDentista" && (

          <CadastroDentista

            voltar={() =>
              setPagina(
                ultimaPagina
              )
            }

            aoCadastrarPaciente={
              pacienteCadastrado
            }

          />

        )
      }


      {/* ================================================= */}
      {/* DASHBOARD                                         */}
      {/* ================================================= */}

      {
        pagina ===
          "dashboard" && (

          <Dashboard

            voltarHome={() =>
              setPagina("home")
            }

            abrirAgenda={() =>
              setPagina("agenda")
            }

            abrirPacientes={() =>
              setPagina(
                "pacientes"
              )
            }

            abrirFinanceiro={() =>
              setPagina(
                "financeiro"
              )
            }

            sair={() => {

              localStorage.removeItem(
                "logado"
              )

              localStorage.removeItem(
                "pagina"
              )

              setPagina("home")

            }}

          />

        )
      }


      {/* ================================================= */}
      {/* AGENDA                                            */}
      {/* ================================================= */}

      {
        pagina === "agenda" && (

          <Agenda

            voltar={() =>
              setPagina(
                "dashboard"
              )
            }

            abrirPerfil={
              abrirPerfil
            }

            abrirCadastroDentista={() =>
              abrirCadastroDentista(
                "agenda"
              )
            }

            abrirCadastroPaciente={
              (
                novoAgendamento
              ) =>
                abrirCadastroDentista(
                  "agenda",
                  {
                    novoAgendamento
                  }
                )
            }

            retornoAgendamento={
              retornoAgendamento
            }

            limparRetornoAgendamento={() =>
              setRetornoAgendamento(null)
            }

          />

        )
      }


      {/* ================================================= */}
      {/* PACIENTES                                         */}
      {/* ================================================= */}

      {
        pagina ===
          "pacientes" && (

          <Pacientes

            voltar={() =>
              setPagina(
                "dashboard"
              )
            }

            abrirPerfil={
              abrirPerfil
            }

            abrirCadastro={() =>
              abrirCadastroDentista(
                "pacientes"
              )
            }

          />

        )
      }


      {/* ================================================= */}
      {/* PERFIL                                            */}
      {/* ================================================= */}

      {
        pagina === "perfil" && (

          <PerfilPaciente

            paciente={
              pacienteSelecionado
            }

            voltar={() =>
              setPagina(
                paginaAnterior
              )
            }

            voltarPacientes={() =>
              setPagina(
                "pacientes"
              )
            }

            origem={
              paginaAnterior
            }

          />

        )
      }


      {/* ================================================= */}
      {/* FINANCEIRO                                        */}
      {/* ================================================= */}

      {
        pagina === "financeiro" && (

          <Financeiro

            consultas={
              consultas
            }

            voltar={() =>
              setPagina(
                "dashboard"
              )
            }

          />

        )
      }


    </>

  )

}


export default App