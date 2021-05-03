/**
 * https://parzibyte.me/blog
 */
const pdf = require("html-pdf");
const fs = require("fs");
const ubicacionPlantilla = require.resolve("./factura.html");
let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf8')
// Estos productos podrían venir de cualquier lugar
const productos = [
    {
        descripcion: "Nintendo Switch",
        cantidad: 2,
        precio: 9000,
    },
    {
        descripcion: "Videojuego: Hollow Knight",
        cantidad: 1,
        precio: 150,
    },
    {
        descripcion: "Audífonos HyperX",
        cantidad: 5,
        precio: 1500,
    },
];

// Nota: el formateador solo es para, valga la redundancia, formatear el dinero. No es requerido, solo que quiero que se vea bonito
// https://parzibyte.me/blog/2021/05/03/formatear-dinero-javascript/
const formateador = new Intl.NumberFormat("en", { style: "currency", "currency": "MXN" });
// Generar el HTML de la tabla
let tabla = "";
let subtotal = 0;
for (const producto of productos) {
    // Aumentar el total
    const totalProducto = producto.cantidad * producto.precio;
    subtotal += totalProducto;
    // Y concatenar los productos
    tabla += `<tr>
    <td>${producto.descripcion}</td>
    <td>${producto.cantidad}</td>
    <td>${formateador.format(producto.precio)}</td>
    <td>${formateador.format(totalProducto)}</td>
    </tr>`;
}
const descuento = 0;
const subtotalConDescuento = subtotal - descuento;
const impuestos = subtotalConDescuento * 0.16
const total = subtotalConDescuento + impuestos;
// Remplazar el valor {{tablaProductos}} por el verdadero valor
contenidoHtml = contenidoHtml.replace("{{tablaProductos}}", tabla);

// Y también los otros valores

contenidoHtml = contenidoHtml.replace("{{subtotal}}", formateador.format(subtotal));
contenidoHtml = contenidoHtml.replace("{{descuento}}", formateador.format(descuento));
contenidoHtml = contenidoHtml.replace("{{subtotalConDescuento}}", formateador.format(subtotalConDescuento));
contenidoHtml = contenidoHtml.replace("{{impuestos}}", formateador.format(impuestos));
contenidoHtml = contenidoHtml.replace("{{total}}", formateador.format(total));
pdf.create(contenidoHtml).toFile("salida.pdf", (error) => {
    if (error) {
        console.log("Error creando PDF: " + error)
    } else {
        console.log("PDF creado correctamente");
    }
});