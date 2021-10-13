// Comienzo de las funciones

// Metodo que carga todos los datos de un producto, ingresados por el usuario mediante boton agregar en pantalla.
function ingresarDatosDelProducto() {
    let precio = parseFloat(prompt("Ingrese el precio de su producto."));
    let cantidadCuotas = parseFloat(prompt("En cuantas cuotas fue adquirido el mismo?"));

    let montoCuota = calcularValorCuota(precio, cantidadCuotas).toFixed(2);
    alert(`El valor de su cuota sera de ${montoCuota} y le haremos acuerdo de la misma en el comienzo de cada mes.`);
    // Objeto producto con sus respectiva información será cargada mediante prompts y carga el producto en un array.
}

// Metodo que envía sms ficticio al usuario avisando que un producto está proximo a vencer.
function avisoCuotaCercaDeVencimiento(producto) {
    // Codigo para enviar sms o email, en este contexto simplemente levantará un alert.
}

// Metodo que borra el producto deseado de la pagina del usuario, opcion en pantalla para el usuario final.
function borrarProducto(nombreProducto) {
    // Codigo que elimina producto del array de productos.
}

// Metodo que segun un monto dado y un numero de cuotas ingresado calcula el monto de cada cuota en caso de necesitarlo.
function calcularValorCuota(precioProducto, numeroCuotas) {
    return precioProducto / numeroCuotas;
}

// Metodo que suma todas las cuotas a pagar del siguiente mes y corroborar que no sobrepasa el limite mensual de la tarjeta del usuario.
function calcularPagoMensualDeTarjeta(productos, limiteMensualTarjeta) {
    // Recorrer array de productos e ir sumando el valor de cuota a pagar de cada uno de ellos y comparar contra el limite mensual de tarjeta del usuario.
}

// Metodo que suma y retorna el precio de cada producto para que el usuario pueda ver el global de sus deudas.
function calcularMontoTotalDeProductos(productos) {
    // Recorrer array de productos y sumar los montos totales de cada uno y retornar un global.
}

// Metodo que incrementa en 1 la cantidad de cuotas pagas de un producto.
function pagarCuota(producto) {
    // Incrementar en 1 cuotasPagas de un producto una vez definido el objeto.
}

// Metodo que cambia el estado de un producto de Pagando a Pago, esto por interfaz grafica hace que el producto pase a una sección de articulos ya pagos.
function considerarPago(producto) {
    // Cuando las cuotasPagas == numeroCuotas, cambiar estado de producto a Pago.
}

// Metodo que avisa al usuario por pantalla y por email que una cuota ha expirado como tambien pasar el producto a una seccion de cuotas vencidas.
function pagoAtrasado() {
    // Si fechaVencimiento de algun producto es mayor que dia de hoy, enviar alerta a usuario.
}

// Metodo que sirve para redireccionar a la pagina del banco del usuario y efectuar el pago de la cuota en cuestion, disparado por un boton Pagar en cada producto.
function pagar(producto) {
    // Abrir pagina de login del banco.
}

// Fin de las funciones

ingresarDatosDelProducto();