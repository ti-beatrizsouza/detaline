function SemanaNavigator({
  offsetSemana,
  setOffsetSemana
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px"
      }}
    >
      <button
        onClick={() =>
          setOffsetSemana(offsetSemana - 1)
        }
        style={{
          background: "#ffffff",
          color: "#b30086",
          border: "none",
          borderRadius: "14px",
          padding: "12px 20px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
          transition: "0.2s"
        }}
      >
        ← Semana Anterior
      </button>

      <button
        onClick={() =>
          setOffsetSemana(offsetSemana + 1)
        }
        style={{
          background: "#ffffff",
          color: "#b30086",
          border: "none",
          borderRadius: "14px",
          padding: "12px 20px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
          transition: "0.2s"
        }}
      >
        Próxima Semana →
      </button>
    </div>
  )
}

export default SemanaNavigator