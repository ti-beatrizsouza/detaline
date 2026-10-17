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
    tipoPcd,
    setTipoPcd
  ] = useState("")


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


    if (!texto) {
      return ""
    }


    /*
     * Preserva números internacionais
     * que não usam o código do Brasil.
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
     * Remove o código do Brasil do valor
     * já formatado, mesmo se o número estiver
     * incompleto durante uma edição.
     */

    if (
      texto.startsWith("+55") &&
      numeros.startsWith("55")
    ) {

      numeros =
        numeros.substring(2)

    }

    /*
     * Também aceita o código 55 digitado
     * sem o sinal de + em um número completo.
     */

    else if (
      numeros.startsWith("55") &&
      numeros.length > 11
    ) {

      numeros =
        numeros.substring(2)

    }


    /*
     * Não corta silenciosamente números
     * com quantidade inválida de dígitos.
     */

    if (numeros.length > 11) {
      return texto
    }


    /*
     * Telefone celular completo com DDD.
     */

    if (
      numeros.length === 11
    ) {

      return (
        `+55 (${numeros.slice(0, 2)}) ` +
        `${numeros.slice(2, 7)}-${numeros.slice(7)}`
      )

    }


    /*
     * Telefone fixo completo com DDD.
     */

    if (
      numeros.length === 10
    ) {

      return (
        `+55 (${numeros.slice(0, 2)}) ` +
        `${numeros.slice(2, 6)}-${numeros.slice(6)}`
      )

    }


    /*
     * Celular sem DDD.
     * Não acrescenta DDD automaticamente.
     */

    if (
      numeros.length === 9
    ) {

      return (
        `${numeros.slice(0, 5)}-${numeros.slice(5)}`
      )

    }


    /*
     * Telefone fixo sem DDD.
     * Não acrescenta DDD automaticamente.
     */

    if (
      numeros.length === 8
    ) {

      return (
        `${numeros.slice(0, 4)}-${numeros.slice(4)}`
      )

    }


    /*
     * Preserva o texto se estiver incompleto,
     * para não apagar o que a pessoa digitou.
     */

    return texto

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
          formatarTelefone(
            telefone
          ),

        tipoPaciente:
          tipoPaciente || "Clínica geral",

        tipoPcd:
          tipoPaciente === "PCD"
            ? tipoPcd.trim()
            : "",

        responsavel:
          nomeResponsavel,

        telResponsavel:
          formatarTelefone(
            telefoneResponsavel
          ),

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
                  e.target.value
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
              onChange={(e) => {
                const novoTipo =
                  e.target.value

                setTipoPaciente(
                  novoTipo
                )

                if (novoTipo !== "PCD") {
                  setTipoPcd("")
                }
              }}
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

              <option value="PCD">
                PCD
              </option>

              <option value="Outro">
                Outro
              </option>

            </select>


            {tipoPaciente === "PCD" && (
              <input
                type="text"
                placeholder="Tipo de PCD"
                value={tipoPcd}
                onChange={(e) =>
                  setTipoPcd(
                    e.target.value
                  )
                }
              />
            )}

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
                  e.target.value
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