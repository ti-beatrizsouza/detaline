import {
  useEffect,
  useState
} from "react"

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch
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
    /* NORMALIZAR NOME                                       */
    /* ===================================================== */

    function normalizarNome(nome) {

      return String(nome || "")
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .trim()
        .toLowerCase()

    }


    /* ===================================================== */
    /* ORGANIZAR TAGS ATUAIS                                */
    /* ===================================================== */

    async function organizarTags() {

      try {

        /*
          IMPORTANTE:

          Essa é uma NOVA versão da migração.

          Não usamos mais:
          configuracoes/tagsPacientes

          porque a migração anterior pode já ter marcado
          aquele documento como concluído.

          Agora usamos:
          configuracoes/tagsPacientesV2
        */

        const controleRef =
          doc(
            db,
            "configuracoes",
            "tagsPacientesV2"
          )


        const pacientesSnapshot =
          await getDocs(
            collection(
              db,
              "pacientes"
            )
          )


        const lista = []


        pacientesSnapshot.forEach(
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

          await setDoc(
            controleRef,
            {
              migrado: true
            }
          )

          return

        }


        /* ================================================= */
        /* PROCURAR BEATRIZ                                  */
        /* ================================================= */

        const beatriz =
          lista.find(
            (paciente) => {

              const nome =
                normalizarNome(
                  paciente.nome
                )

              return (
                nome === "beatriz" ||
                nome.startsWith(
                  "beatriz "
                )
              )

            }
          )


        /* ================================================= */
        /* PROCURAR ANDRÉ KONRAD                             */
        /* ================================================= */

        const andre =
          lista.find(
            (paciente) => {

              const nome =
                normalizarNome(
                  paciente.nome
                )

              return (
                nome === "andre konrad" ||
                nome.startsWith(
                  "andre konrad "
                )
              )

            }
          )


        console.log(
          "BEATRIZ ENCONTRADA:",
          beatriz?.nome
        )

        console.log(
          "ANDRÉ ENCONTRADO:",
          andre?.nome
        )


        /* ================================================= */
        /* OUTROS PACIENTES                                  */
        /* ================================================= */

        const outros =
          lista.filter(
            (paciente) => {

              return (
                paciente.id !==
                  beatriz?.id &&
                paciente.id !==
                  andre?.id
              )

            }
          )


        /* ================================================= */
        /* NÚMEROS 3 ATÉ 32                                 */
        /* ================================================= */

        const numeros = []


        for (
          let numero = 3;
          numero <= 32;
          numero++
        ) {

          numeros.push(
            numero
          )

        }


        /* ================================================= */
        /* EMBARALHAR                                       */
        /* ================================================= */

        for (
          let i =
            numeros.length - 1;
          i > 0;
          i--
        ) {

          const j =
            Math.floor(
              Math.random() *
              (i + 1)
            )


          const temporario =
            numeros[i]


          numeros[i] =
            numeros[j]


          numeros[j] =
            temporario

        }


        /* ================================================= */
        /* BATCH                                            */
        /* ================================================= */

        let batch =
          writeBatch(
            db
          )


        let quantidadeNoBatch = 0


        function adicionarAtualizacao(
          paciente,
          numero
        ) {

          const referencia =
            doc(
              db,
              "pacientes",
              paciente.id
            )


          batch.update(
            referencia,
            {
              tag:
                `#${numero}`
            }
          )


          quantidadeNoBatch++

        }


        /* ================================================= */
        /* BEATRIZ = #1                                     */
        /* ================================================= */

        if (beatriz) {

          adicionarAtualizacao(
            beatriz,
            1
          )

        }


        /* ================================================= */
        /* ANDRÉ = #2                                       */
        /* ================================================= */

        if (andre) {

          adicionarAtualizacao(
            andre,
            2
          )

        }


        /* ================================================= */
        /* OUTROS = #3 ATÉ #32                              */
        /* ================================================= */

        outros.forEach(
          (
            paciente,
            indice
          ) => {

            let numero


            if (
              indice <
              numeros.length
            ) {

              /*
                #3 até #32
                em ordem ALEATÓRIA.
              */

              numero =
                numeros[indice]

            } else {

              /*
                Caso existam mais de 32 pacientes,
                os excedentes continuam normalmente.
              */

              numero =
                33 +
                (
                  indice -
                  numeros.length
                )

            }


            adicionarAtualizacao(
              paciente,
              numero
            )

          }
        )


        /* ================================================= */
        /* SALVAR                                             */
        /* ================================================= */

        if (
          quantidadeNoBatch > 0
        ) {

          await batch.commit()

        }


        /* ================================================= */
        /* MARCAR V2 COMO CONCLUÍDA                          */
        /* ================================================= */

        await setDoc(
          controleRef,
          {
            migrado: true,
            quantidade:
              lista.length,
            atualizadoEm:
              new Date()
          }
        )


        console.log(
          "Tags dos pacientes reorganizadas com sucesso."
        )


      } catch (error) {

        console.error(
          "Erro ao organizar tags:",
          error
        )

      }

    }


    /* ===================================================== */
    /* LISTENER                                             */
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
    /* EXECUTAR                                             */
    /* ===================================================== */

    async function iniciar() {

      await organizarTags()

      iniciarListener()

    }


    iniciar()


    /* ===================================================== */
    /* LIMPEZA                                              */
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