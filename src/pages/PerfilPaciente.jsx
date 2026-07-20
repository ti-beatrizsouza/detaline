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

import "../styles/perfil.css"

function PerfilPaciente({

  paciente,
  voltar,
  voltarPacientes,
  origem

}) {

  const [editando,
    setEditando] =
    useState(false)

  const [dados,
    setDados] =
    useState({

      ...paciente

    })

  async function salvarEdicao() {

 await updateDoc(
  doc(
    db,
    "pacientes",
    paciente.id
  ),
  {
    nome:
      dados.nome || "",

    idade:
      Number(
        dados.idade || 0
      ),

    tel:
      dados.tel || "",

    responsavel:
      dados.responsavel || "",

    telResponsavel:
      dados.telResponsavel || "",

    cpfResponsavel:
      dados.cpfResponsavel || "",

    proxConsulta:
      dados.proxConsulta || "",

    ultimaConsulta:
      dados.ultimaConsulta || "",

    obs:
      dados.obs || "",

    totalPago:
      Number(
        dados.totalPago || 0
      )
  }
)

    alert(
      "Paciente atualizado!"
    )

    setEditando(false)

  }

  async function excluirPaciente() {

  const confirmar = window.confirm(

    `Deseja realmente excluir ${dados.nome}?\n\nEsta ação não poderá ser desfeita.`

  )

  if (!confirmar) return

  try {

    const consultas = query(

      collection(db, "agenda"),

      where(

        "pacienteId",

        "==",

        paciente.id

      )

    )

    const snapshot = await getDocs(consultas)

    for (const consulta of snapshot.docs) {

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

    alert("Paciente excluído com sucesso!")

    voltarPacientes()

  }

  catch (erro) {

    console.error(erro)

    alert("Erro ao excluir paciente.")

  }

}

  return (

    <main className="perfil-container">

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

        <h1>

          Perfil do Paciente

        </h1>

      </div>

      <div className="perfil-card">

        <div className="perfil-foto">

  {dados.foto ? (

    <img
      src={dados.foto}
      alt={dados.nome}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%"
      }}
    />

  ) : (

    dados.nome
      ?.charAt(0)
      ?.toUpperCase()

  )}

</div>

        {

          editando ? (

            <div className="perfil-grid">

              <input

                value={dados.nome || ""}

                placeholder="Nome"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    nome:
                      e.target.value

                  })
                }

              />

              <input

                type="number"

                value={dados.idade || ""}

                placeholder="Idade"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    idade:
                      e.target.value

                  })
                }

              />

              <input

                value={dados.tel || ""}

                placeholder="tel"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    tel:
                      e.target.value

                  })
                }

              />

              <input

                value={
                  dados.responsavel || ""
                }

                placeholder="Nome do responsável"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    responsavel:
                      e.target.value

                  })
                }

              />

              <input

                value={
                  dados.telResponsavel || ""
                }

                placeholder="tel responsável"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    telResponsavel:
                      e.target.value

                  })
                }

              />

              <input

                value={
                  dados.cpfResponsavel || ""
                }

                placeholder="CPF responsável"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    cpfResponsavel:
                      e.target.value

                  })
                }

              />

              <label>
                Próxima consulta
              </label>

              <input

                type="date"

                value={
                  dados.proxConsulta || ""
                }

                onChange={(e) =>
                  setDados({

                    ...dados,

                    proxConsulta:
                      e.target.value

                  })
                }

              />

              <label>
                Última consulta
              </label>

              <input

                type="date"

                value={
                  dados.ultimaConsulta || ""
                }

                onChange={(e) =>
                  setDados({

                    ...dados,

                    ultimaConsulta:
                      e.target.value

                  })
                }

              />

              <textarea

                value={dados.obs || ""}

                placeholder="Observações"

                onChange={(e) =>
                  setDados({

                    ...dados,

                    obs:
                      e.target.value

                  })
                }

              />

              <button
                className="salvar-btn"
                onClick={
                  salvarEdicao
                }
              >

                Salvar Alterações

              </button>

            </div>

          ) : (

            <div className="perfil-info">

              <h2>

                {dados.nome}

              </h2>

              <p>

                <strong>
  Idade:
</strong>{" "}
{dados.idade || "-"} anos

              </p>

              <p>

                <strong>
                  Telefone:
                </strong>{" "}

                {dados.tel || "-"}

              </p>

              <p>

                <strong>
                  Responsável:
                </strong>{" "}

                {
                  dados.responsavel || "-"
                }

              </p>

              <p>

                <strong>
                  Telefone Responsável:
                </strong>{" "}

                {
                  dados.telResponsavel || "-"
                }

              </p>

              <p>

                <strong>
                  CPF responsável:
                </strong>{" "}

                {
                  dados.cpfResponsavel || "-"
                }

              </p>

              <p>

                <strong>
                  Próxima consulta:
                </strong>{" "}

                {
                  dados.proxConsulta || "-"
                }

              </p>

              <p>

                <strong>
                  Última consulta:
                </strong>{" "}

                {
                  dados.ultimaConsulta || "-"
                }

              </p>

              <p>

                <strong>
                  Total Pago:
                </strong>{" "}

                R$ {

                  Number(
                    dados.totalPago || 0
                  ).toFixed(2)

                }

              </p>

              <div className="perfil-obs">

                <strong>
                  Observações
                </strong>

                <p>

                  {

                    dados.obs ||

                    "Sem observações"

                  }

                </p>

              </div>

              <button

                className="editar-btn"

                onClick={() =>
                  setEditando(true)
                }

              >

                Editar Dados

              </button>

              <button

  className="remover-btn"

  onClick={excluirPaciente}

>

  Excluir Paciente

</button>

            </div>

          )

        }

      </div>

    </main>

  )

}

export default PerfilPaciente