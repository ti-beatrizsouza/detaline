import {
  useState
} from "react"

import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp
} from "firebase/firestore"

import {
  db
} from "../services/firebase"

import logoDentaline from "../assets/logob.png"

import "../styles/cadastroDentista.css"


function CadastroDentista({

  voltar,
  aoCadastrarPaciente

}) {

  const [
    nome,
    setNome
  ] = useState("")


  const [
    telefone,
    setTelefone
  ] = useState("")


  const [
    cpf,
    setCpf
  ] = useState("")


  const [
    nascimento,
    setNascimento
  ] = useState("")


  const [
    nascimentoFocado,
    setNascimentoFocado
  ] = useState(false)


  const [
    tipoPaciente,
    setTipoPaciente
  ] = useState("Clínica geral")


  const [
    nomeResponsavel,
    setNomeResponsavel
  ] = useState("")


  const [
    cpfResponsavel,
    setCpfResponsavel
  ] = useState("")


  const [
    telefoneResponsavel,
    setTelefoneResponsavel
  ] = useState("")


  const [
    obs,
    setObs
  ] = useState("")


  const [
    fotoNome,
    setFotoNome
  ] = useState("")


  /* ===================================================== */
  /* TELEFONE                                              */
  /* ===================================================== */

  function formatarTelefone(
    valor
  ) {

    const texto =
      String(
        valor || ""
      ).trim()


    /*
     * Se começar com + e NÃO for +55,
     * preserva o código internacional informado.
     *
     * Ex.:
     * +11...
     * +1...
     * +351...
     *
     * Não substitui por +55 nem por DDD 92.
     */

    if (
      texto.startsWith("+") &&
      !texto
        .replace(/\D/g, "")
        .startsWith("55")
    ) {

      return texto

    }


    let numeros =
      texto.replace(
        /\D/g,
        ""
      )


    /*
     * Se digitou o código do Brasil,
     * remove apenas o 55 para depois
     * reconstruir o padrão.
     *
     * Ex.:
     * 5511992801082
     * → 11992801082
     */

    if (
      numeros.startsWith("55") &&
      numeros.length > 11
    ) {

      numeros =
        numeros.substring(2)

    }


    /*
     * Número completo com DDD.
     *
     * NÃO altera o DDD.
     *
     * 11992801082 → DDD 11
     * 31992801082 → DDD 31
     * 92992801082 → DDD 92
     */

    if (
      numeros.length === 11
    ) {

      // mantém exatamente os 11 dígitos


    }


    /*
     * Número de celular sem DDD.
     *
     * Nesse caso, e somente nesse caso,
     * assume DDD 92.
     */

    else if (
      numeros.length === 9
    ) {

      numeros =
        "92" + numeros

    }


    /*
     * Número fixo sem DDD.
     *
     * Nesse caso, e somente nesse caso,
     * assume DDD 92.
     */

    else if (
      numeros.length === 8
    ) {

      numeros =
        "92" + numeros

    }


    /*
     * Limita a 11 dígitos.
     */

    numeros =
      numeros.substring(
        0,
        11
      )


    /*
     * Campo vazio.
     */

    if (
      numeros.length === 0
    ) {

      return ""

    }


    /*
     * DDD incompleto.
     */

    if (
      numeros.length <= 2
    ) {

      return (
        `+55 (${numeros}`
      )

    }


    /*
     * Telefone fixo.
     *
     * +55 (92) 3300-1234
     */

    if (
      numeros.length <= 10
    ) {

      return (
        `+55 (${numeros.slice(0, 2)}) ` +
        `${numeros.slice(2, 6)}` +
        (
          numeros.length > 6
            ? `-${numeros.slice(6)}`
            : ""
        )
      )

    }


    /*
     * Celular.
     *
     * +55 (92) 99280-1082
     */

    return (
      `+55 (${numeros.slice(0, 2)}) ` +
      `${numeros.slice(2, 7)}-${numeros.slice(7)}`
    )

  }


  /* ===================================================== */
  /* CPF                                                   */
  /* ===================================================== */

  function formatarCPF(
    valor
  ) {

    valor =
      valor.replace(
        /\D/g,
        ""
      )


    valor =
      valor.substring(
        0,
        11
      )


    valor =
      valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
      )


    valor =
      valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
      )


    valor =
      valor.replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
      )


    return valor

  }


  /* ===================================================== */
  /* IDADE                                                 */
  /* ===================================================== */

  function calcularIdade(
    data
  ) {

    if (!data) {
      return 0
    }


    const hoje =
      new Date()


    const nasc =
      new Date(data)


    let idade =
      hoje.getFullYear() -
      nasc.getFullYear()


    const mes =
      hoje.getMonth() -
      nasc.getMonth()


    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoje.getDate() <
          nasc.getDate()
      )
    ) {

      idade--

    }


    return idade

  }


  /* ===================================================== */
  /* PRÓXIMA TAG                                           */
  /* ===================================================== */

  async function descobrirProximaTag() {

    const snapshot =
      await getDocs(
        collection(
          db,
          "pacientes"
        )
      )


    let maiorTag = 0


    snapshot.forEach(
      (documento) => {

        const dados =
          documento.data()


        const numero =
          parseInt(
            String(
              dados.tag || ""
            ).replace(
              "#",
              ""
            ),
            10
          )


        if (
          !Number.isNaN(
            numero
          ) &&
          numero >
            maiorTag
        ) {

          maiorTag =
            numero

        }

      }
    )


    return `#${maiorTag + 1}`

  }


  /* ===================================================== */
  /* CADASTRAR                                             */
  /* ===================================================== */

  async function cadastrar(
    e
  ) {

    e.preventDefault()


    try {

      const novaTag =
        await descobrirProximaTag()


      const pacienteData = {

        nome,

        foto: "",

        cpf,

        nascimento,

        idade:
          calcularIdade(
            nascimento
          ),

        tel:
          telefone,

        tipoPaciente:
          tipoPaciente || "Clínica geral",

        responsavel:
          nomeResponsavel,

        telResponsavel:
          telefoneResponsavel,

        cpfResponsavel,

        obs,

        totalPago: 0,

        timeline: [],

        tag:
          novaTag,

        criadoEm:
          serverTimestamp()

      }


      /* ================================================= */
      /* SALVAR NO FIREBASE                                */
      /* ================================================= */

      const novoPaciente =
        await addDoc(
          collection(
            db,
            "pacientes"
          ),
          pacienteData
        )


      /* ================================================= */
      /* PACIENTE COMPLETO                                 */
      /* ================================================= */

      const pacienteCriado = {

        id:
          novoPaciente.id,

        ...pacienteData

      }


      /* ================================================= */
      /* DEVOLVER PARA O AGENDAMENTO                       */
      /* ================================================= */

      if (
        aoCadastrarPaciente
      ) {

        aoCadastrarPaciente(
          pacienteCriado
        )

      }


      alert(
        `Paciente cadastrado com a tag ${novaTag}!`
      )


      voltar()

    }

    catch (error) {

      console.error(
        error
      )


      alert(
        `Código:
${error.code}

Mensagem:
${error.message}`
      )

    }

  }


  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (

    <main className="cadastro-dentista-container">


      {/* ================================================= */}
      {/* TOPO                                              */}
      {/* ================================================= */}

      <div className="cadastro-topo">

        <button
          className="voltar-btn"
          type="button"
          onClick={voltar}
        >
          ← Voltar para Pacientes
        </button>


        <div className="cadastro-titulo-logo">

          <h1>
            CADASTRO DE PACIENTE
          </h1>


          <img
            src={logoDentaline}
            alt="Dentaline"
            className="cadastro-logo-topo"
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* CARD PRINCIPAL                                    */}
      {/* ================================================= */}

      <form
        className="cadastro-dentista-box"
        onSubmit={cadastrar}
      >


        {/* ================================================= */}
        {/* CABEÇALHO                                         */}
        {/* ================================================= */}

        <div className="cadastro-identificacao">


          <div className="foto-box">

            <div className="foto-preview">

              {
                fotoNome
                  ? "📷"
                  : "👤"
              }

            </div>


            <label className="foto-btn">

              Escolher foto

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFotoNome(
                    e.target
                      .files?.[0]
                      ?.name || ""
                  )
                }
              />

            </label>


            {
              fotoNome && (

                <small>
                  {fotoNome}
                </small>

              )
            }

          </div>


          <div className="cadastro-nome-area">

            <span>
              NOVO PACIENTE
            </span>


            <h2>
              Cadastro
            </h2>


            <p>
              Preencha as informações do paciente
              para criar seu cadastro.
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* DADOS DO PACIENTE                                 */}
        {/* ================================================= */}

        <div className="cadastro-secao">

          <div className="cadastro-secao-titulo">
            Dados do paciente
          </div>


          <div className="form-grid">

            <input
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              required
            />


            <input
              placeholder="Telefone do paciente"
              value={telefone}
              onChange={(e) =>
                setTelefone(
                  formatarTelefone(
                    e.target.value
                  )
                )
              }
              inputMode="numeric"
              type="tel"
            />


            <input
              className="campo-nascimento"
              type={
                nascimentoFocado ||
                nascimento
                  ? "date"
                  : "text"
              }
              placeholder="Data de nascimento"
              value={nascimento}
              onFocus={() =>
                setNascimentoFocado(true)
              }
              onBlur={() => {

                if (!nascimento) {

                  setNascimentoFocado(false)

                }

              }}
              onChange={(e) =>
                setNascimento(
                  e.target.value
                )
              }
            />


            <input
              placeholder="CPF do paciente"
              value={cpf}
              onChange={(e) =>
                setCpf(
                  formatarCPF(
                    e.target.value
                  )
                )
              }
              inputMode="numeric"
            />


            {/* ================================================= */}
            {/* TIPO DE PACIENTE                                  */}
            {/* ================================================= */}

            <select
              value={tipoPaciente}
              onChange={(e) =>
                setTipoPaciente(
                  e.target.value
                )
              }
            >

              <option value="Ortodontia">
                Ortodontia
              </option>

              <option value="Odontopediatria">
                Odontopediatria
              </option>

              <option value="Clínica geral">
                Clínica geral
              </option>

              <option value="Outro">
                Outro
              </option>

            </select>

          </div>

        </div>


        {/* ================================================= */}
        {/* RESPONSÁVEL                                       */}
        {/* ================================================= */}

        <div className="cadastro-secao">

          <div className="cadastro-secao-titulo">
            Dados do responsável
          </div>


          <div className="form-grid">

            <input
              placeholder="Nome do responsável"
              value={nomeResponsavel}
              onChange={(e) =>
                setNomeResponsavel(
                  e.target.value
                )
              }
            />


            <input
              placeholder="Telefone do responsável"
              value={telefoneResponsavel}
              onChange={(e) =>
                setTelefoneResponsavel(
                  formatarTelefone(
                    e.target.value
                  )
                )
              }
              inputMode="numeric"
              type="tel"
            />


            <input
              placeholder="CPF do responsável"
              value={cpfResponsavel}
              onChange={(e) =>
                setCpfResponsavel(
                  formatarCPF(
                    e.target.value
                  )
                )
              }
              inputMode="numeric"
            />

          </div>

        </div>


        {/* ================================================= */}
        {/* OBSERVAÇÕES                                       */}
        {/* ================================================= */}

        <div className="cadastro-obs">

          <div className="cadastro-obs-topo">

            <div>

              <span>
                ANOTAÇÕES
              </span>

              <strong>
                Observações
              </strong>

            </div>


            <span className="cadastro-obs-info">
              Informações adicionais sobre o paciente
            </span>

          </div>


          <textarea
            className="obs-textarea"
            placeholder="Adicione observações sobre o paciente..."
            value={obs}
            onChange={(e) =>
              setObs(
                e.target.value
              )
            }
          />

        </div>


        {/* ================================================= */}
        {/* CADASTRAR                                         */}
        {/* ================================================= */}

        <button
          type="submit"
          className="cadastrar-btn"
        >
          Cadastrar Paciente
        </button>


      </form>

    </main>

  )

}


export default CadastroDentista