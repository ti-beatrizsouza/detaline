function SemanaNavigator({
  offsetSemana,
  setOffsetSemana,
  dataPesquisa,
  setDataPesquisa,
  irParaData
}) {

  function pesquisarData() {

    if (!dataPesquisa) {
      return
    }

    irParaData(dataPesquisa)

  }

  return (

    <div className="semana-navegador">

      <button
        onClick={() =>
          setOffsetSemana(
            offsetSemana - 1
          )
        }
      >
        ← Semana Anterior
      </button>


      <div className="pesquisar-data">

        <input
          type="date"
          value={dataPesquisa}
          onChange={(e) =>
            setDataPesquisa(
              e.target.value
            )
          }
        />

        <button
          onClick={pesquisarData}
        >
          Pesquisar Data
        </button>

      </div>


      <button
        onClick={() =>
          setOffsetSemana(
            offsetSemana + 1
          )
        }
      >
        Próxima Semana →
      </button>

    </div>

  )
}

export default SemanaNavigator