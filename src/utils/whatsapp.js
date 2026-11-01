export function criarLinkWhatsApp(telefone) {
  const texto = String(telefone || "").trim()

  if (!texto) {
    return ""
  }

  const digitos = texto.replace(/\D/g, "")

  if (texto.startsWith("+")) {
    if (digitos.length < 8 || digitos.length > 15) {
      return ""
    }

    return `https://wa.me/${digitos}`
  }

  if (digitos.length === 10 || digitos.length === 11) {
    return `https://wa.me/55${digitos}`
  }

  if (
    digitos.startsWith("55") &&
    (digitos.length === 12 || digitos.length === 13)
  ) {
    return `https://wa.me/${digitos}`
  }

  return ""
}