import { useState } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import CadastroPaciente from "./pages/CadastroPaciente"
import CadastroDentista from "./pages/CadastroDentista"
import Dashboard from "./pages/Dashboard"
import Agenda from "./pages/Agenda"
import Pacientes from "./pages/Pacientes"
import PerfilPaciente from "./pages/PerfilPaciente"

function App() {

  const [pagina, setPagina] =
    useState("home")

  const [ultimaPagina,
    setUltimaPagina] =
    useState("pacientes")

  const [pacienteSelecionado,
    setPacienteSelecionado] =
    useState(null)

  const [paginaAnterior,
    setPaginaAnterior] =
    useState("pacientes")

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

  function abrirCadastroDentista(
    origem
  ) {

    setUltimaPagina(
      origem
    )

    setPagina(
      "cadastroDentista"
    )

  }

  return (

    <>

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

      {

        pagina === "login" && (

          <Login

            voltar={() =>
              setPagina("home")
            }

            entrar={() =>
              setPagina(
                "dashboard"
              )
            }

          />

        )

      }

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

      {

        pagina ===
          "cadastroDentista" && (

          <CadastroDentista

            voltar={() =>
              setPagina(
                ultimaPagina
              )
            }

          />

        )

      }

      {

        pagina ===
          "dashboard" && (

          <Dashboard

            abrirAgenda={() =>
              setPagina("agenda")
            }

            abrirPacientes={() =>
              setPagina(
                "pacientes"
              )
            }

            sair={() =>
              setPagina("home")
            }

          />

        )

      }

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

          />

        )

      }

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

            origem={
              paginaAnterior
            }

          />

        )

      }

    </>

  )

}

export default App