import jsPDF from 'jspdf'
import type { CartItem } from '../contexts/CartContext'
import isotipo from '../assets/brand/Isotipo.svg'

const WINE = {
  r: 89,
  g: 14,
  b: 26,
}

const GOLD = {
  r: 184,
  g: 138,
  b: 68,
}

const LIGHT_TEXT = {
  r: 110,
  g: 110,
  b: 110,
}

const PAGE_WIDTH = 210

/**
 * Convierte el Isotipo SVG en una imagen PNG transparente
 * para utilizarlo como marca de agua.
 */
async function svgToPng(
  svgUrl: string,
  width = 800,
  height = 800
): Promise<string> {
  const response = await fetch(svgUrl)
  const svgText = await response.text()

  const svgBlob = new Blob([svgText], {
    type: 'image/svg+xml;charset=utf-8',
  })

  const url = URL.createObjectURL(svgBlob)

  try {
    const image = new Image()

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () =>
        reject(
          new Error(
            'No se pudo cargar el isotipo de Alaska Beauty.'
          )
        )

      image.src = url
    })

    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error(
        'No se pudo crear el canvas para el isotipo.'
      )
    }

    context.clearRect(0, 0, width, height)

    /*
     * Opacidad de la marca de agua.
     *
     * 0.14 = visible pero todavía elegante y discreta.
     */
    context.globalAlpha = 0.14

    context.drawImage(image, 0, 0, width, height)

    return canvas.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Agrega el isotipo como marca de agua.
 */
function addWatermark(
  pdf: jsPDF,
  watermark: string
) {
  const watermarkSize = 115

  const x = (PAGE_WIDTH - watermarkSize) / 2
  const y = 92

  pdf.addImage(
    watermark,
    'PNG',
    x,
    y,
    watermarkSize,
    watermarkSize
  )
}

/**
 * Genera la cotización en PDF.
 */
export async function generateQuotePdf(
  items: CartItem[],
  totalPrice: number
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const watermark = await svgToPng(isotipo)

  /*
   * Formato de moneda colombiano.
   *
   * Ejemplos:
   * 8500  → $8.500
   * 15000 → $15.000
   * 1250000 → $1.250.000
   */
  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-CO')}`

  /*
   * --------------------------------------------------
   * PRIMERA PÁGINA
   * --------------------------------------------------
   */

  // Marca de agua
  addWatermark(pdf, watermark)

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  pdf.setTextColor(WINE.r, WINE.g, WINE.b)
  pdf.setFont('times', 'bold')
  pdf.setFontSize(26)

  pdf.text('Alaska Beauty', 20, 25)

  pdf.setTextColor(GOLD.r, GOLD.g, GOLD.b)
  pdf.setFont('times', 'normal')
  pdf.setFontSize(11)

  pdf.text('Cotización de productos', 20, 33)

  // Línea decorativa del encabezado
  pdf.setDrawColor(WINE.r, WINE.g, WINE.b)
  pdf.setLineWidth(0.3)

  pdf.line(20, 40, 190, 40)

  // --------------------------------------------------
  // FECHA
  // --------------------------------------------------

  const date = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  pdf.setTextColor(WINE.r, WINE.g, WINE.b)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)

  pdf.text(`Fecha: ${date}`, 20, 50)

  // --------------------------------------------------
  // ENCABEZADOS
  // --------------------------------------------------

  let y = 65

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10.5)

  pdf.setTextColor(WINE.r, WINE.g, WINE.b)

  pdf.text('Producto', 20, y)
  pdf.text('Cant.', 135, y)
  pdf.text('Subtotal', 160, y)

  y += 8

  // Línea únicamente debajo de los encabezados
  pdf.setDrawColor(WINE.r, WINE.g, WINE.b)
  pdf.setLineWidth(0.2)

  pdf.line(20, y, 190, y)

  y += 8

  // --------------------------------------------------
  // PRODUCTOS
  // --------------------------------------------------

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)

  items.forEach((item, index) => {
    const subtotal =
      item.product.precio * item.cantidad

    const productName =
      item.product.nombre.length > 38
        ? `${item.product.nombre.substring(0, 35)}...`
        : item.product.nombre

    pdf.setTextColor(
      WINE.r,
      WINE.g,
      WINE.b
    )

    pdf.text(productName, 20, y)

    pdf.text(String(item.cantidad), 138, y)

    pdf.text(formatPrice(subtotal), 160, y)

    /*
     * Espacio limpio entre productos.
     *
     * No agregamos líneas ni separadores.
     */
    y += 12

    /*
     * Si ya no queda suficiente espacio,
     * creamos una nueva página.
     */
    if (
      y > 250 &&
      index < items.length - 1
    ) {
      pdf.addPage()

      addWatermark(pdf, watermark)

      y = 30

      pdf.setTextColor(
        WINE.r,
        WINE.g,
        WINE.b
      )

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10.5)

      pdf.text('Producto', 20, y)
      pdf.text('Cant.', 135, y)
      pdf.text('Subtotal', 160, y)

      y += 8

      pdf.setDrawColor(
        WINE.r,
        WINE.g,
        WINE.b
      )

      pdf.setLineWidth(0.2)

      pdf.line(20, y, 190, y)

      y += 8

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
    }
  })

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  y += 6

  pdf.setDrawColor(
    WINE.r,
    WINE.g,
    WINE.b
  )

  pdf.setLineWidth(0.3)

  pdf.line(20, y, 190, y)

  y += 12

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)

  pdf.setTextColor(
    WINE.r,
    WINE.g,
    WINE.b
  )

  pdf.text(
    'Total estimado',
    20,
    y
  )

  pdf.text(
    formatPrice(totalPrice),
    160,
    y
  )

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)

  pdf.setTextColor(
    LIGHT_TEXT.r,
    LIGHT_TEXT.g,
    LIGHT_TEXT.b
  )

  pdf.text(
    'Este documento es una cotización y no representa una orden de compra.',
    20,
    278
  )

  pdf.text(
    'El pago y la entrega se coordinan directamente con Alaska Beauty.',
    20,
    284
  )

  // --------------------------------------------------
  // GUARDAR PDF
  // --------------------------------------------------

  pdf.save(
    `cotizacion-alaska-beauty-${Date.now()}.pdf`
  )
}