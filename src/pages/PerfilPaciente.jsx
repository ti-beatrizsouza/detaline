import {
  useEffect,
  useState
} from "react"

import {
  doc,
  getDoc,
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
import cogumelo from "../assets/cogumelo.png"

import "../styles/perfilPaciente.css"


/* ========================================================= */
/* CALCULAR IDADE                                             */
/* ========================================================= */

function calcularIdade(
  dataNascimento
) {

  if (!dataNascimento) {
    return null
  }

  const nascimento =
    new Date(
      `${dataNascimento}T00:00:00`
    )

  if (
    isNaN(
      nascimento.getTime()
    )
  ) {
    return null
  }

  const hoje =
    new Date()

  let idade =
    hoje.getFullYear() -
    nascimento.getFullYear()

  if (
    hoje.getMonth() <
    nascimento.getMonth() ||
    (
      hoje.getMonth() ===
        nascimento.getMonth() &&
      hoje.getDate() <
        nascimento.getDate()
    )
  ) {

    idade--

  }

  return idade >= 0
    ? idade
    : null

}


/* ========================================================= */
/* FORMATAR DATA DE NASCIMENTO                                */
/* ========================================================= */

function formatarDataNascimento(
  data
) {

  if (!data) {
    return null
  }

  const partes =
    data.split("-")

  if (
    partes.length !== 3
  ) {
    return data
  }

  return (
    `${partes[2]}/${partes[1]}/${partes[0]}`
  )

}


/* ========================================================= */
/* FORMATAR TELEFONE                                          */
/* ========================================================= */

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
   * já formatado, inclusive se estiver incompleto.
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
   * Celular completo com DDD.
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


/* ========================================================= */
/* PERFIL DO PACIENTE                                         */
/* ========================================================= */

function PerfilPaciente({
  paciente,
  voltar,
  voltarPacientes,
  origem
}) {


  /* ======================================================= */
  /* DADOS                                                   */
  /* ======================================================= */

  const [
    dados,
    setDados
  ] = useState({
    ...paciente
  })


  /* ======================================================= */
  /* EDIÇÃO                                                   */
  /* ======================================================= */

  const [
    editando,
    setEditando
  ] = useState(false)


  const [
    salvandoDados,
    setSalvandoDados
  ] = useState(false)


  /* ======================================================= */
  /* OBSERVAÇÕES                                              */
  /* ======================================================= */

  const [
    observacoes,
    setObservacoes
  ] = useState(
    paciente?.obs || ""
  )


  const [
    salvandoObs,
    setSalvandoObs
  ] = useState(false)


  /* ======================================================= */
  /* CARREGAR DADOS DIRETO DO FIREBASE                       */
  /* ======================================================= */

  useEffect(() => {

    async function carregarPaciente() {

      if (!paciente?.id) {
        return
      }

      try {

        const referencia =
          doc(
            db,
            "pacientes",
            paciente.id
          )


        const snapshot =
          await getDoc(
            referencia
          )


        if (
          snapshot.exists()
        ) {

          const pacienteAtualizado = {

            id:
              snapshot.id,

            ...snapshot.data()

          }


          /* =============================================== */
          /* CORRIGIR TELEFONES ANTIGOS                       */
          /* =============================================== */

          const telefoneFormatado =
            formatarTelefone(
              pacienteAtualizado.tel
            )


          const telefoneResponsavelFormatado =
            formatarTelefone(
              pacienteAtualizado.telResponsavel
            )


          const telefoneMudou =
            telefoneFormatado !==
            (
              pacienteAtualizado.tel ||
              ""
            )


          const telefoneResponsavelMudou =
            telefoneResponsavelFormatado !==
            (
              pacienteAtualizado.telResponsavel ||
              ""
            )


          /*
           * Se algum telefone antigo estiver
           * sem o padrão de exibição, atualiza no Firebase.
           */

          if (
            telefoneMudou ||
            telefoneResponsavelMudou
          ) {

            const dadosTelefone = {

              tel:
                telefoneFormatado,

              telResponsavel:
                telefoneResponsavelFormatado

            }


            await updateDoc(
              referencia,
              dadosTelefone
            )


            pacienteAtualizado.tel =
              telefoneFormatado


            pacienteAtualizado.telResponsavel =
              telefoneResponsavelFormatado

          }


          setDados(
            pacienteAtualizado
          )


          setObservacoes(
            pacienteAtualizado.obs || ""
          )


          localStorage.setItem(
            "pacienteSelecionado",
            JSON.stringify(
              pacienteAtualizado
            )
          )

        }

      }

      catch (erro) {

        console.error(
          "Erro ao carregar paciente:",
          erro
        )

      }

    }


    carregarPaciente()

  }, [paciente?.id])


  /* ======================================================= */
  /* INICIAR EDIÇÃO                                           */
  /* ======================================================= */

  function iniciarEdicao() {

    setEditando(true)

  }


  /* ======================================================= */
  /* CANCELAR EDIÇÃO                                         */
  /* ======================================================= */

  async function cancelarEdicao() {

    try {

      const referencia =
        doc(
          db,
          "pacientes",
          paciente.id
        )


      const snapshot =
        await getDoc(
          referencia
        )


      if (
        snapshot.exists()
      ) {

        const pacienteAtualizado = {

          id:
            snapshot.id,

          ...snapshot.data()

        }


        setDados(
          pacienteAtualizado
        )


        setObservacoes(
          pacienteAtualizado.obs || ""
        )

      }

    }

    catch (erro) {

      console.error(
        "Erro ao restaurar dados:",
        erro
      )

    }

    setEditando(false)

  }


  /* ======================================================= */
  /* ALTERAR CAMPO                                            */
  /* ======================================================= */

  function alterarCampo(
    campo,
    valor
  ) {

    setDados(
      atual => {

        const atualizado = {
          ...atual,
          [campo]: valor
        }

        if (
          campo === "tipoPaciente" &&
          valor !== "PCD"
        ) {
          atualizado.tipoPcd = ""
        }

        return atualizado
      }
    )

  }


  /* ======================================================= */
  /* ALTERAR TELEFONE                                        */
  /* ======================================================= */

  function alterarTelefone(
    campo,
    valor
  ) {

    setDados(
      atual => ({

        ...atual,

        [campo]:
          valor

      })
    )

  }


  /* ======================================================= */
  /* ALTERAR DATA DE NASCIMENTO                              */
  /* ======================================================= */

  function alterarDataNascimento(
    valor
  ) {

    const idade =
      calcularIdade(
        valor
      )


    setDados(
      atual => ({

        ...atual,

        dataNascimento:
          valor,

        idade:
          idade !== null
            ? String(idade)
            : atual.idade || ""

      })
    )

  }


  /* ======================================================= */
  /* SALVAR INFORMAÇÕES                                      */
  /* ======================================================= */

  async function salvarInformacoes() {

    if (!dados?.id) {
      return
    }


    try {

      setSalvandoDados(
        true
      )


      let idadeFinal = ""


      /*
       * Se houver data de nascimento,
       * ela tem prioridade.
       */

      if (
        dados.dataNascimento
      ) {

        const idade =
          calcularIdade(
            dados.dataNascimento
          )


        idadeFinal =
          idade !== null
            ? String(idade)
            : ""

      }

      else {

        idadeFinal =
          dados.idade
            ? String(
                dados.idade
              )
            : ""

      }


      /* ================================================= */
      /* FORMATAR TELEFONES                                */
      /* ================================================= */

      const telefoneFinal =
        formatarTelefone(
          dados.tel
        )


      const telefoneResponsavelFinal =
        formatarTelefone(
          dados.telResponsavel
        )


      const dadosParaSalvar = {

        nome:
          dados.nome || "",

        apelido:
          dados.apelido || "",

        idade:
          idadeFinal,

        dataNascimento:
          dados.dataNascimento || "",

        tel:
          telefoneFinal,

        tipoPaciente:
          dados.tipoPaciente || "Clínica geral",

        tipoPcd:
          dados.tipoPaciente === "PCD"
            ? String(
                dados.tipoPcd || ""
              ).trim()
            : "",

        responsavel:
          dados.responsavel || "",

        telResponsavel:
          telefoneResponsavelFinal,

        cpfResponsavel:
          dados.cpfResponsavel || "",

        proxConsulta:
          dados.proxConsulta || "",

        ultimaConsulta:
          dados.ultimaConsulta || ""

      }


      /* ================================================= */
      /* FIREBASE                                           */
      /* ================================================= */

      const referencia =
        doc(
          db,
          "pacientes",
          dados.id
        )


      await updateDoc(
        referencia,
        dadosParaSalvar
      )


      /* ================================================= */
      /* ESTADO LOCAL                                      */
      /* ================================================= */

      const pacienteAtualizado = {

        ...dados,

        ...dadosParaSalvar

      }


      setDados(
        pacienteAtualizado
      )


      /* ================================================= */
      /* LOCAL STORAGE                                    */
      /* ================================================= */

      localStorage.setItem(
        "pacienteSelecionado",
        JSON.stringify(
          pacienteAtualizado
        )
      )


      setEditando(
        false
      )

    }

    catch (erro) {

      console.error(
        "Erro ao atualizar informações:",
        erro
      )

      alert(
        "Erro ao atualizar as informações do paciente."
      )

    }

    finally {

      setSalvandoDados(
        false
      )

    }

  }


  /* ======================================================= */
  /* SALVAR OBSERVAÇÕES                                      */
  /* ======================================================= */

  async function salvarObservacoes() {

    if (!dados?.id) {
      return
    }


    if (
      observacoes ===
      (
        dados.obs || ""
      )
    ) {

      return

    }


    try {

      setSalvandoObs(
        true
      )


      const referencia =
        doc(
          db,
          "pacientes",
          dados.id
        )


      await updateDoc(
        referencia,
        {
          obs:
            observacoes
        }
      )


      const pacienteAtualizado = {

        ...dados,

        obs:
          observacoes

      }


      setDados(
        pacienteAtualizado
      )


      localStorage.setItem(
        "pacienteSelecionado",
        JSON.stringify(
          pacienteAtualizado
        )
      )

    }

    catch (erro) {

      console.error(
        "Erro ao salvar observações:",
        erro
      )

      alert(
        "Erro ao salvar as observações."
      )

    }

    finally {

      setSalvandoObs(
        false
      )

    }

  }


  /* ======================================================= */
  /* EXCLUIR PACIENTE                                        */
  /* ======================================================= */

  async function excluirPaciente() {

    const confirmar =
      window.confirm(
        `Deseja realmente excluir ${dados.nome}?\n\nEsta ação não poderá ser desfeita.`
      )


    if (!confirmar) {
      return
    }


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
            dados.id
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
          dados.id
        )
      )


      localStorage.removeItem(
        "pacienteSelecionado"
      )


      voltarPacientes()

    }

    catch (erro) {

      console.error(
        "Erro ao excluir paciente:",
        erro
      )

      alert(
        "Erro ao excluir paciente."
      )

    }

  }


  /* ======================================================= */
  /* IDADE PARA EXIBIÇÃO                                    */
  /* ======================================================= */

  const idadeCalculada =
    calcularIdade(
      dados.dataNascimento
    )


  const idadeExibida =
    idadeCalculada !== null
      ? idadeCalculada
      : dados.idade
        ? Number(
            dados.idade
          )
        : null


  /* ======================================================= */
  /* RENDER                                                  */
  /* ======================================================= */

  return (

    <main className="perfil-container">


      {/* ================================================= */}
      {/* COGUMELO                                           */}
      {/* ================================================= */}

      <img
        className="perfil-cogumelo"
        src={cogumelo}
        alt=""
        aria-hidden="true"
      />


      {/* ================================================= */}
      {/* TOPO                                               */}
      {/* ================================================= */}

      <div className="perfil-topo">


        <div className="perfil-topo-esquerda">

          <button
            type="button"
            className="perfil-voltar"
            onClick={voltar}
          >
            ← Voltar para {
              origem === "agenda"
                ? "Agenda"
                : "Pacientes"
            }
          </button>

        </div>


        <div className="perfil-marca">


          <div className="perfil-titulo-texto">

            <span className="perfil-marca-texto">
              DENTALINE
            </span>


            <h1 className="perfil-titulo-alice">
              Perfil do Paciente
            </h1>


            <p>
              Gerencie as informações e o histórico do paciente.
            </p>

          </div>


          <img
            className="perfil-logo-topo"
            src={logoDentaline}
            alt="Dentaline"
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* CARD PRINCIPAL                                     */}
      {/* ================================================= */}

      <div className="perfil-card">


        {/* ================================================= */}
        {/* AÇÕES                                             */}
        {/* ================================================= */}

        <div className="perfil-acoes">


          {!editando ? (

            <button
              type="button"
              className="editar-info-btn"
              onClick={iniciarEdicao}
            >
              ✎ Editar informações
            </button>

          ) : (

            <>

              <button
                type="button"
                className="cancelar-edicao-btn"
                onClick={cancelarEdicao}
                disabled={salvandoDados}
              >
                Cancelar
              </button>


              <button
                type="button"
                className="salvar-info-btn"
                onClick={salvarInformacoes}
                disabled={salvandoDados}
              >
                {
                  salvandoDados
                    ? "Salvando..."
                    : "Salvar informações"
                }
              </button>

            </>

          )}


          <button
            type="button"
            className="remover-btn"
            onClick={excluirPaciente}
          >
            Excluir Paciente
          </button>


        </div>


        {/* ================================================= */}
        {/* IDENTIFICAÇÃO                                    */}
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
                ? dados.nome
                    .charAt(0)
                    .toUpperCase()
                : "P"

            )}

          </div>


          <div className="perfil-nome">

            <span>
              PACIENTE
            </span>


            <h2>
              {dados.nome || "Paciente"}
            </h2>


            <span className="perfil-tag">
              {dados.tag || "#—"}
            </span>

          </div>


        </div>


        {/* ================================================= */}
        {/* DADOS                                             */}
        {/* ================================================= */}

        <div className="perfil-dados">


          {/* APELIDO */}

          <div className="perfil-dado">

            <span>
              Apelido
            </span>


            {editando ? (

              <input
                type="text"
                value={
                  dados.apelido || ""
                }
                onChange={(e) =>
                  alterarCampo(
                    "apelido",
                    e.target.value
                  )
                }
                placeholder="Digite o apelido"
              />

            ) : (

              <strong>
                {dados.apelido || "Não definido"}
              </strong>

            )}

          </div>


          {/* TIPO DE PACIENTE */}

          <div className="perfil-dado">

            <span>
              Tipo de paciente
            </span>


            {editando ? (

              <select
                value={
                  dados.tipoPaciente || "Clínica geral"
                }
                onChange={(e) =>
                  alterarCampo(
                    "tipoPaciente",
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

                <option value="PCD">
                  PCD
                </option>

                <option value="Outro">
                  Outro
                </option>

              </select>

            ) : (

              <strong>
                {dados.tipoPaciente || "Clínica geral"}
              </strong>

            )}

          </div>


          {dados.tipoPaciente === "PCD" && (
            <div className="perfil-dado">

              <span>
                Tipo de PCD
              </span>


              {editando ? (

                <input
                  type="text"
                  value={
                    dados.tipoPcd || ""
                  }
                  onChange={(e) =>
                    alterarCampo(
                      "tipoPcd",
                      e.target.value
                    )
                  }
                  placeholder="Informe o tipo de PCD"
                />

              ) : (

                <strong>
                  {dados.tipoPcd || "Não informado"}
                </strong>

              )}

            </div>
          )}


          {/* IDADE / DATA DE NASCIMENTO */}

          <div className="perfil-dado">

            <span>
              Idade / Data de nascimento
            </span>


            {editando ? (

              <div className="idade-edicao">


                <input
                  type="number"
                  min="0"
                  max="150"
                  value={
                    dados.dataNascimento
                      ? (
                          idadeExibida ??
                          ""
                        )
                      : (
                          dados.idade || ""
                        )
                  }
                  onChange={(e) =>
                    alterarCampo(
                      "idade",
                      e.target.value
                    )
                  }
                  placeholder="Idade"
                />


                <span>
                  ou
                </span>


                <input
                  type="date"
                  value={
                    dados.dataNascimento || ""
                  }
                  onChange={(e) =>
                    alterarDataNascimento(
                      e.target.value
                    )
                  }
                />

              </div>

            ) : (

              <strong>

                {idadeExibida !== null
                  ? `${idadeExibida} anos`
                  : "Não informado"
                }

                {dados.dataNascimento &&
                  ` - ${formatarDataNascimento(
                    dados.dataNascimento
                  )}`
                }

              </strong>

            )}

          </div>


          {/* TELEFONE */}

          <div className="perfil-dado">

            <span>
              Telefone
            </span>


            {editando ? (

              <input
                type="tel"
                inputMode="numeric"
                value={
                  dados.tel || ""
                }
                onChange={(e) =>
                  alterarTelefone(
                    "tel",
                    e.target.value
                  )
                }
                placeholder="Telefone"
              />

            ) : (

              <strong>
                {dados.tel || "Não informado"}
              </strong>

            )}

          </div>


          {/* RESPONSÁVEL */}

          <div className="perfil-dado">

            <span>
              Responsável
            </span>


            {editando ? (

              <input
                type="text"
                value={
                  dados.responsavel || ""
                }
                onChange={(e) =>
                  alterarCampo(
                    "responsavel",
                    e.target.value
                  )
                }
                placeholder="Nome do responsável"
              />

            ) : (

              <strong>
                {
                  dados.responsavel ||
                  "Não informado"
                }
              </strong>

            )}

          </div>


          {/* TELEFONE DO RESPONSÁVEL */}

          <div className="perfil-dado">

            <span>
              Telefone do responsável
            </span>


            {editando ? (

              <input
                type="tel"
                inputMode="numeric"
                value={
                  dados.telResponsavel || ""
                }
                onChange={(e) =>
                  alterarTelefone(
                    "telResponsavel",
                    e.target.value
                  )
                }
                placeholder="Telefone"
              />

            ) : (

              <strong>
                {
                  dados.telResponsavel ||
                  "Não informado"
                }
              </strong>

            )}

          </div>


          {/* CPF */}

          <div className="perfil-dado">

            <span>
              CPF do responsável
            </span>


            {editando ? (

              <input
                type="text"
                value={
                  dados.cpfResponsavel || ""
                }
                onChange={(e) =>
                  alterarCampo(
                    "cpfResponsavel",
                    e.target.value
                  )
                }
                placeholder="CPF"
              />

            ) : (

              <strong>
                {
                  dados.cpfResponsavel ||
                  "Não informado"
                }
              </strong>

            )}

          </div>


          {/* PRÓXIMA CONSULTA */}

          <div className="perfil-dado">

            <span>
              Próxima consulta
            </span>


            {editando ? (

              <input
                type="date"
                value={
                  dados.proxConsulta || ""
                }
                onChange={(e) =>
                  alterarCampo(
                    "proxConsulta",
                    e.target.value
                  )
                }
              />

            ) : (

              <strong>
                {
                  dados.proxConsulta ||
                  "-"
                }
              </strong>

            )}

          </div>


          {/* ÚLTIMA CONSULTA */}

          <div className="perfil-dado">

            <span>
              Última consulta
            </span>


            {editando ? (

              <input
                type="date"
                value={
                  dados.ultimaConsulta || ""
                }
                onChange={(e) =>
                  alterarCampo(
                    "ultimaConsulta",
                    e.target.value
                  )
                }
              />

            ) : (

              <strong>
                {
                  dados.ultimaConsulta ||
                  "-"
                }
              </strong>

            )}

          </div>


          {/* TOTAL PAGO */}

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
        {/* OBSERVAÇÕES                                      */}
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


          <button
            type="button"
            className="salvar-obs-btn"
            onClick={salvarObservacoes}
            disabled={
              salvandoObs ||
              observacoes === (
                dados.obs || ""
              )
            }
          >
            {
              salvandoObs
                ? "Salvando..."
                : "Salvar observações"
            }
          </button>


        </div>


      </div>


      {/* ================================================= */}
      {/* RODAPÉ                                             */}
      {/* ================================================= */}

      <footer className="perfil-footer">

        <span>
          Dentaline
        </span>

        <span>
          Gestão odontológica
        </span>

      </footer>


    </main>

  )

}


export default PerfilPaciente