import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../services/firebase"

export default function useConsultas() {

  const [consultas, setConsultas] = useState([])

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "agenda"),

      (snapshot) => {

        const lista = []

        snapshot.forEach((doc) => {

          lista.push({
            id: doc.id,
            ...doc.data()
          })

        })

        setConsultas(lista)

      }

    )

    return () => unsubscribe()

  }, [])

  return consultas

}