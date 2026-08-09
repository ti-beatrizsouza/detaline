import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../services/firebase"

export default function usePacientes() {

  const [pacientes, setPacientes] = useState([])

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "pacientes"),

      (snapshot) => {

        const lista = []

        snapshot.forEach((doc) => {

          lista.push({

            id: doc.id,
            ...doc.data()

          })

        })

        setPacientes(lista)

      }

    )

    return () => unsubscribe()

  }, [])

  return pacientes

}