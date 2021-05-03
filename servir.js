/**
 * Tomado de https://parzibyte.me/blog/2019/05/27/node-js-express-ejemplo-creacion-proyecto/
 * By Parzibyte
 */
// Importar dependencias
const express = require("express"),
    app = express(),
    pdf = require("html-pdf"),
    fs = require("fs");

// Constantes propias del programa
const ubicacionPlantilla = require.resolve("./factura.html"),
    puerto = 3000;
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
// Definir rutas
app.get('/', (peticion, respuesta) => {
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
    pdf.create(contenidoHtml).toStream((error, stream) => {
        if (error) {
            respuesta.end("Error creando PDF: " + error)
        } else {
            respuesta.setHeader("Content-Type", "application/pdf");
            stream.pipe(respuesta);
        }
    });
});

// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(puerto, err => {
    if (err) {
        // Aquí manejar el error
        console.error("Error escuchando: ", err);
        return;
    }
    // Si no se detuvo arriba con el return, entonces todo va bien ;)
    console.log(`Escuchando en el puerto :${puerto}`);
});