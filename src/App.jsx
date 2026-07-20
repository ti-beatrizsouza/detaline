import { useState, useEffect } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import CadastroPaciente from "./pages/CadastroPaciente"
import CadastroDentista from "./pages/CadastroDentista"
import Dashboard from "./pages/Dashboard"
import Agenda from "./pages/Agenda"
import Pacientes from "./pages/Pacientes"
import PerfilPaciente from "./pages/PerfilPaciente"

function App() {

  const [pagina, setPagina] = useState(() => {

  const paginaSalva = localStorage.getItem("pagina")

  return paginaSalva || "home"

})

  const [ultimaPagina,
  setUltimaPagina] =
  useState(() =>

    localStorage.getItem("ultimaPagina") ||

    "pacientes"

  )

  const [pacienteSelecionado,
setPacienteSelecionado] =

useState(() => {

  const salvo = localStorage.getItem(
    "pacienteSelecionado"
  )

  return salvo

    ? JSON.parse(salvo)

    : null

})

  const [paginaAnterior,
  setPaginaAnterior] =
  useState(() =>

    localStorage.getItem("paginaAnterior") ||

    "pacientes"

  )

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

useEffect(() => {

  const logado = localStorage.getItem(
    "logado"
  )

  if (

    logado === "true" &&

    pagina === "home"

  ) {

    setPagina(
      "dashboard"
    )

  }

}, [])

useEffect(() => {

  localStorage.setItem(

    "pacienteSelecionado",

    JSON.stringify(
      pacienteSelecionado
    )

  )

}, [pacienteSelecionado])

useEffect(() => {

  localStorage.setItem(

    "ultimaPagina",

    ultimaPagina

  )

}, [ultimaPagina])

useEffect(() => {

  localStorage.setItem(

    "paginaAnterior",

    paginaAnterior

  )

}, [paginaAnterior])

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

  paciente={pacienteSelecionado}

  voltar={() =>
    setPagina(paginaAnterior)
  }

  voltarPacientes={() =>
    setPagina("pacientes")
  }

  origem={paginaAnterior}

/>

        )

      }

    </>

  )

}

export default App