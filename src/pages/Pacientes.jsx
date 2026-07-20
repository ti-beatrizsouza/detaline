import {

  useEffect,
  useState

} from "react"

import {

  collection,
  onSnapshot

} from "firebase/firestore"

import {

  db

} from "../services/firebase"

import "../styles/pacientes.css"

function Pacientes({

  voltar,
  abrirPerfil,
  abrirCadastro

}) {

  const [pacientes,
    setPacientes] =
    useState([])

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "pacientes"
        ),

        (snapshot) => {

          const lista = []

          snapshot.forEach((doc) => {

            lista.push({

              id: doc.id,
              ...doc.data()

            })

          })

          lista.sort((a, b) =>
            a.nome.localeCompare(
              b.nome
            )
          )

          setPacientes(lista)

        }

      )

    return () =>
      unsubscribe()

  }, [])

  async function agendarPeloTopo() {

  if (!pacienteTopo || !diaTopo) {
    alert("Preencha paciente e data")
    return
  }

  const paciente = pacientes.find(
    p => p.id === pacienteTopo
  )

  const dataObj = new Date(diaTopo)

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ]

  await addDoc(
    collection(db, "agenda"),
    {
      pacienteId: paciente.id,
      nome: paciente.nome,
      dia: diasSemana[dataObj.getDay()],
      hora: horaTopo,
      data: diaTopo,
      status: statusTopo,
      valorPago: 0
    }
  )

  setPacienteTopo("")
  setDiaTopo("")
  setHoraTopo("07:00")
  setStatusTopo("agendado")
}

  return (

    <main className="pacientes-container">

      <div className="pacientes-topo">

        <div className="pacientes-titulo">

          <button
            onClick={voltar}
          >

            ← Voltar

          </button>

          <h1>
            Pacientes
          </h1>

        </div>

        <button
  className="novo-paciente-btn"
  onClick={abrirCadastro}
>
  + Cadastrar Paciente
</button>

      </div>

      <div className="pacientes-lista">

        {

          pacientes.map(
            (paciente) => (

            <div

              key={paciente.id}

              className="paciente-card"

              onClick={() =>
                abrirPerfil(
                  paciente,
                  "pacientes"
                )
              }

            >

              <div className="paciente-foto">

                {

                  paciente.nome?.[0]

                }

              </div>

              <div className="paciente-info">

                <h2>

                  {paciente.nome}

                </h2>

                <p>

                  Próxima consulta:
                  {" "}

                  {
                    paciente.proxConsulta
                    || "Não definida"
                  }

                </p>

                <p>

                  Observações:
                  {" "}

                  {
                    paciente.obs
                    || "Sem observações"
                  }

                </p>

              </div>

            </div>

          ))

        }

      </div>

    </main>

  )

}

export default Pacientes