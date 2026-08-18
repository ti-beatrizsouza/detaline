import {
  useState
} from "react"

import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore"

import {
  db
} from "../services/firebase"

import logoDentaline from "../assets/logob.png"

import "../styles/perfilPaciente.css"


function PerfilPaciente({

  paciente,
  voltar,
  voltarPacientes,
  origem

}) {

  const [
    dados,
    setDados
  ] = useState({
    ...paciente
  })


  const [
    observacoes,
    setObservacoes
  ] = useState(
    paciente.obs || ""
  )


  const [
    salvandoObs,
    setSalvandoObs
  ] = useState(false)


  async function salvarObservacoes() {

    if (
      observacoes === (
        dados.obs || ""
      )
    ) {
      return
    }


    try {

      setSalvandoObs(true)


      await updateDoc(

        doc(
          db,
          "pacientes",
          paciente.id
        ),

        {
          obs: observacoes
        }

      )


      setDados({

        ...dados,

        obs: observacoes

      })


      alert(
        "Observações atualizadas!"
      )

    }

    catch (erro) {

      console.error(erro)

      alert(
        "Erro ao salvar as observações."
      )

    }

    finally {

      setSalvandoObs(false)

    }

  }


  async function excluirPaciente() {

    const confirmar =
      window.confirm(

        `Deseja realmente excluir ${dados.nome}?\n\nEsta ação não poderá ser desfeita.`

      )


    if (!confirmar)
      return


    try {

      const consultas =
        query(

          collection(
            db,
            "agenda"
          ),

          where(
            "pacienteId",
            "==",
            paciente.id
          )

        )


      const snapshot =
        await getDocs(
          consultas
        )


      for (
        const consulta
        of snapshot.docs
      ) {

        await deleteDoc(

          doc(
            db,
            "agenda",
            consulta.id
          )

        )

      }


      await deleteDoc(

        doc(
          db,
          "pacientes",
          paciente.id
        )

      )


      alert(
        "Paciente excluído com sucesso!"
      )


      voltarPacientes()

    }

    catch (erro) {

      console.error(erro)

      alert(
        "Erro ao excluir paciente."
      )

    }

  }


  return (

    <main className="perfil-container">


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <div className="perfil-topo">


        <button
          className="perfil-voltar"
          onClick={voltar}
        >

          ← Voltar para {
            origem === "agenda"
              ? "Agenda"
              : "Pacientes"
          }

        </button>


        <div className="perfil-titulo-logo">

          <h1>
            PERFIL DO PACIENTE
          </h1>


          <img
            className="perfil-logo-topo"
            src={logoDentaline}
            alt="Dentaline"
          />

        </div>


      </div>


      {/* ================================================= */}
      {/* CARD                                              */}
      {/* ================================================= */}

      <div className="perfil-card">


        {/* ================================================= */}
        {/* AÇÕES                                            */}
        {/* ================================================= */}

        <div className="perfil-acoes">


          <button
            className="salvar-obs-btn"
            onClick={salvarObservacoes}
            disabled={
              salvandoObs ||
              observacoes === (
                dados.obs || ""
              )
            }
          >

            {salvandoObs
              ? "Salvando..."
              : "Salvar observações"
            }

          </button>


          <button
            className="remover-btn"
            onClick={excluirPaciente}
          >

            Excluir Paciente

          </button>


        </div>


        {/* ================================================= */}
        {/* CABEÇALHO DO PACIENTE                            */}
        {/* ================================================= */}

        <div className="perfil-identificacao">


          <div className="perfil-foto">

            {dados.foto ? (

              <img
                src={dados.foto}
                alt={dados.nome}
              />

            ) : (

              dados.nome
                ?.charAt(0)
                ?.toUpperCase()

            )}

          </div>


          <div className="perfil-nome">

            <span>
              PACIENTE
            </span>


            <h2>
              {dados.nome}
            </h2>


            {dados.tag && (

              <div className="perfil-tag">
                {dados.tag}
              </div>

            )}

          </div>


        </div>


        {/* ================================================= */}
        {/* DADOS                                            */}
        {/* ================================================= */}

        <div className="perfil-dados">


          <div className="perfil-dado">

            <span>
              Idade
            </span>

            <strong>
              {dados.idade || "-"}
              {dados.idade ? " anos" : ""}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Telefone
            </span>

            <strong>
              {dados.tel || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Responsável
            </span>

            <strong>
              {dados.responsavel || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Telefone do responsável
            </span>

            <strong>
              {dados.telResponsavel || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              CPF do responsável
            </span>

            <strong>
              {dados.cpfResponsavel || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Próxima consulta
            </span>

            <strong>
              {dados.proxConsulta || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Última consulta
            </span>

            <strong>
              {dados.ultimaConsulta || "-"}
            </strong>

          </div>


          <div className="perfil-dado">

            <span>
              Total pago
            </span>

            <strong className="valor-pago">

              R${" "}

              {Number(
                dados.totalPago || 0
              ).toFixed(2)}

            </strong>

          </div>


        </div>


        {/* ================================================= */}
        {/* OBSERVAÇÕES                                     */}
        {/* ================================================= */}

        <div className="perfil-obs">


          <div className="perfil-obs-topo">

            <div>

              <span>
                ANOTAÇÕES
              </span>

              <strong>
                Observações
              </strong>

            </div>


            <span className="perfil-obs-info">
              Somente este campo pode ser editado
            </span>

          </div>


          <textarea
            value={observacoes}
            placeholder="Adicione observações sobre o paciente..."
            onChange={(e) =>
              setObservacoes(
                e.target.value
              )
            }
          />


        </div>


      </div>


    </main>

  )

}


export default PerfilPaciente