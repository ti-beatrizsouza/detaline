import {
  useEffect,
  useState
} from "react"

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  runTransaction
} from "firebase/firestore"

import {
  db
} from "../services/firebase"


export default function usePacientes() {

  const [
    pacientes,
    setPacientes
  ] = useState([])


  useEffect(() => {

    let unsubscribe


    /* ===================================================== */
    /* ORGANIZAR TAGS                                        */
    /* ===================================================== */

    async function organizarTags() {

      try {

        const pacientesRef =
          collection(
            db,
            "pacientes"
          )


        const snapshot =
          await getDocs(
            pacientesRef
          )


        const lista = []


        snapshot.forEach(
          (documento) => {

            lista.push({

              id:
                documento.id,

              ...documento.data()

            })

          }
        )


        /* ================================================= */
        /* SE NÃO HÁ PACIENTES                               */
        /* ================================================= */

        if (
          lista.length === 0
        ) {

          return

        }


        /* ================================================= */
        /* BUSCAR TAGS EXISTENTES                            */
        /* ================================================= */

        const tagsUsadas =
          new Set()


        lista.forEach(
          (paciente) => {

            const tag =
              String(
                paciente.tag || ""
              )
              .replace(
                "#",
                ""
              )
              .trim()


            const numero =
              Number(tag)


            if (
              Number.isInteger(
                numero
              ) &&
              numero > 0
            ) {

              tagsUsadas.add(
                numero
              )

            }

          }
        )


        /* ================================================= */
        /* GARANTIR BEATRIZ SAORY = #1                       */
        /* ================================================= */

        const beatrizSaory =
          lista.find(
            (paciente) => {

              const nome =
                String(
                  paciente.nome || ""
                )
                .normalize("NFD")
                .replace(
                  /[\u0300-\u036f]/g,
                  ""
                )
                .trim()
                .toLowerCase()


              return (
                nome ===
                "beatriz saory nishi souza"
              )

            }
          )


        if (
          beatrizSaory
        ) {

          const tagAtual =
            String(
              beatrizSaory.tag || ""
            )
            .replace(
              "#",
              ""
            )
            .trim()


          /*
            Só corrige para #1 se ela ainda
            estiver sem tag ou estiver com
            uma tag incorreta.

            Caso outra pessoa esteja usando
            #1, ela receberá outro número.
          */

          if (
            tagAtual !== "1"
          ) {

            const pacienteComNumero1 =
              lista.find(
                (paciente) => {

                  const tag =
                    String(
                      paciente.tag || ""
                    )
                    .replace(
                      "#",
                      ""
                    )
                    .trim()

                  return (
                    tag === "1" &&
                    paciente.id !==
                      beatrizSaory.id
                  )

                }
              )


            /*
              Se outra pessoa estiver com #1,
              vamos remover temporariamente
              essa numeração dela.
            */

            if (
              pacienteComNumero1
            ) {

              const novoNumero =
                encontrarProximoNumero(
                  tagsUsadas,
                  2
                )


              await runTransaction(
                db,
                async (
                  transaction
                ) => {

                  transaction.update(

                    doc(
                      db,
                      "pacientes",
                      pacienteComNumero1.id
                    ),

                    {
                      tag:
                        `#${novoNumero}`
                    }

                  )


                  transaction.update(

                    doc(
                      db,
                      "pacientes",
                      beatrizSaory.id
                    ),

                    {
                      tag:
                        "#1"
                    }

                  )

                }
              )


              tagsUsadas.delete(
                1
              )

              tagsUsadas.add(
                novoNumero
              )

              tagsUsadas.add(
                1
              )

            } else {

              await runTransaction(
                db,
                async (
                  transaction
                ) => {

                  transaction.update(

                    doc(
                      db,
                      "pacientes",
                      beatrizSaory.id
                    ),

                    {
                      tag:
                        "#1"
                    }

                  )

                }
              )


              tagsUsadas.add(
                1
              )

            }

          }

        }


        /* ================================================= */
        /* RECARREGAR APÓS CORREÇÃO DA BEATRIZ              */
        /* ================================================= */

        const snapshotAtualizado =
          await getDocs(
            pacientesRef
          )


        const listaAtualizada = []


        snapshotAtualizado.forEach(
          (documento) => {

            listaAtualizada.push({

              id:
                documento.id,

              ...documento.data()

            })

          }
        )


        /* ================================================= */
        /* TAGS EXISTENTES                                   */
        /* ================================================= */

        const numerosExistentes =
          new Set()


        listaAtualizada.forEach(
          (paciente) => {

            const numero =
              Number(
                String(
                  paciente.tag || ""
                )
                .replace(
                  "#",
                  ""
                )
                .trim()
              )


            if (
              Number.isInteger(
                numero
              ) &&
              numero > 0
            ) {

              numerosExistentes.add(
                numero
              )

            }

          }
        )


        /* ================================================= */
        /* PACIENTES SEM TAG                                 */
        /* ================================================= */

        const semTag =
          listaAtualizada.filter(
            (paciente) => {

              const tag =
                String(
                  paciente.tag || ""
                )
                .replace(
                  "#",
                  ""
                )
                .trim()


              return (
                tag === ""
              )

            }
          )


        /* ================================================= */
        /* ATRIBUIR NOVOS NÚMEROS                            */
        /* ================================================= */

        for (
          const paciente
          of semTag
        ) {

          const numero =
            encontrarProximoNumero(
              numerosExistentes,
              2
            )


          await runTransaction(
            db,
            async (
              transaction
            ) => {

              transaction.update(

                doc(
                  db,
                  "pacientes",
                  paciente.id
                ),

                {
                  tag:
                    `#${numero}`
                }

              )

            }
          )


          numerosExistentes.add(
            numero
          )

        }


        console.log(
          "Tags verificadas sem reorganizar pacientes existentes."
        )


      }
      catch (erro) {

        console.error(
          "Erro ao organizar tags:",
          erro
        )

      }

    }


    /* ===================================================== */
    /* ENCONTRAR PRÓXIMO NÚMERO                             */
    /* ===================================================== */

    function encontrarProximoNumero(
      numeros,
      inicio = 1
    ) {

      let numero =
        inicio


      while (
        numeros.has(
          numero
        )
      ) {

        numero++

      }


      return numero

    }


    /* ===================================================== */
    /* LISTENER                                              */
    /* ===================================================== */

    function iniciarListener() {

      unsubscribe =
        onSnapshot(

          collection(
            db,
            "pacientes"
          ),

          (snapshot) => {

            const lista = []


            snapshot.forEach(
              (documento) => {

                lista.push({

                  id:
                    documento.id,

                  ...documento.data()

                })

              }
            )


            setPacientes(
              lista
            )

          }

        )

    }


    /* ===================================================== */
    /* INICIAR                                               */
    /* ===================================================== */

    async function iniciar() {

      await organizarTags()

      iniciarListener()

    }


    iniciar()


    /* ===================================================== */
    /* LIMPEZA                                               */
    /* ===================================================== */

    return () => {

      if (
        unsubscribe
      ) {

        unsubscribe()

      }

    }

  }, [])


  return pacientes

}