// Comienzo declaración de Clases

class Producto {
    
    constructor(nombre, precio, cantidadCuotas, fechaVencimientoCuota) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidadCuotas = cantidadCuotas;
        this.fechaVencimientoCuota = new Date(fechaVencimientoCuota);
        this.cantidadCuotasPagas = 0;
        this.pago = false;
        this.cuotaVencida = false;
    }

    // Getters y setters.

    getNombre() {
        return this.nombre.toLowerCase();
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    getPrecio() {
        return this.precio;
    }

    setPrecio(precio) {
        this.precio = precio;
    }

    getCantidadCuotas() {
        return this.cantidadCuotas;
    }

    setCantidadCuotas(cantidadCuotas) {
        this.cantidadCuotas = cantidadCuotas;
    }

    getCantidadCuotasPagas() {
        return this.cantidadCuotasPagas;
    }

    estaPago() {
        return this.pago;
    }

    getFechaVencimientoCuota() {
        return this.fechaVencimientoCuota;
    }

    setFechaVencimientoCuota(fechaVencimientoCuota) {
        this.fechaVencimientoCuota = fechaVencimientoCuota;
    }

    getCuotaVencida() {
        return this.cuotaVencida;
    }

    // Suma el iva en caso de que se manejen precios de costo.
    sumarIva(){
        this.precio *= 1.22;
    }

    // Metodo que segun un monto dado y un numero de cuotas ingresado calcula el monto de cada cuota.
    calcularValorCuota() {
        return (this.precio / this.cantidadCuotas).toFixed(2);
    }

    // Metodo que incrementa en 1 la cantidad de cuotas pagas de un producto.
    pagarCuota() {
        if (cantidadCuotasPagas != cantidadCuotas) {
            this.cantidadCuotasPagas++;
        } else {
            throw new Error("Todas las cuotas ya estan pagas.");
        }
    }

    // Metodo que cambia el estado de un producto de Pagando a Pago, esto por interfaz grafica hace que el producto pase a una sección de articulos ya pagos.
    considerarPago() {
        this.pago = true;
        this.fechaVencimientoCuota = null;
    }

    // Si la fecha de vencimiento de una cuota es superada en fecha el articulo se considerará vencido y pasará a otra sección de la página.
    considerarVencido() {
        this.cuotaVencida = true;
    }

}

class Inventario {
    constructor(limiteTarjeta) {
        this.productos = [];
        this.limiteTarjeta = limiteTarjeta;
        this.montoTotalProductos = 0;
    }

    // Getters y setters 

    getProductos() {
        return this.productos;
    }

    getLimiteTarjeta() {
        return this.limiteTarjeta;
    }

    setLimiteTarjeta(limiteTarjeta) {
        this.limiteTarjeta = limiteTarjeta;
    }

    getMontoTotalProductos() {
        return this.montoTotalProductos;
    }
    
    // Crea y agrega un producto al inventario de la pagina.
    agregarProducto(producto) {
        this.productos.push(producto);

        let divContainer = document.createElement('div');
        divContainer.innerHTML = `
        
        <div class="product">
            <img class="product__img" src="https://via.placeholder.com/200x150" alt="">
            <div class="product__info">
                <p class="product__title">${producto.getNombre()}</p>
                <p class="product__price">Precio: ${producto.getPrecio()}</p>
                <p class="product__monthlyFee">Monto Cuota: ${producto.calcularValorCuota()}</p>
                <p class="product__feeNumber">Nro Cuotas: ${producto.getCantidadCuotas()}</p>
            </div>
        </div>
        `

        let productList = document.getElementsByClassName('home__main__products');
        productList[0].appendChild(divContainer);
    }

    // Borra producto del inventario.
    borrarProducto(nombreProducto) {
        const producto = this.buscarProductoPorNombre(nombreProducto);
        let index = this.productos.indexOf(producto);

        this.productos.splice(index, 1);
    }

    // Busca un producto dentro del inventario por nombre.
    buscarProductoPorNombre(nombre) {
        nombre = nombre.toLowerCase();

        const producto = this.productos.find(producto => producto.getNombre() === nombre);

        if (producto == null) {
            throw new Error(`El producto con nombre: ${nombre} no existe en el inventario.`);
        }

        return producto;
    }

    // Metodo que suma todas las cuotas a pagar del siguiente mes y corroborar que no sobrepasa el limite mensual de la tarjeta del usuario.
    calcularPagoMensualDeTarjeta() {
        let montoParaPagarEnSiguienteMes = 0;
        for (let i = 0; i < this.productos.length; i++) {
            if (!this.productos[i].estaPago()) {
                montoParaPagarEnSiguienteMes += this.productos[i].calcularValorCuota();
            }
        }

        return montoParaPagarEnSiguienteMes;
    }

    // Metodo que suma y retorna el precio de cada producto para que el usuario pueda ver el global de sus deudas.
    calcularMontoTotalDeProductos() {
        let montoTotalProductos = 0;
        for (let i = 0; i < this.productos.length; i++) {
            if (!this.productos[i].estaPago()) {
                montoTotalProductos += this.productos[i].getPrecio();
            }
        }

        return montoTotalProductos;
    }

    // Metodo que envía sms ficticio al usuario avisando que un producto está proximo a vencer, por ahora levanta alert solamente, necesito ver como ingresar la fecha del producto.
    avisoCuotaCercaDeVencimiento() {
        for (const producto of this.productos) {
            let fechaHoy = new Date();
            if (producto.fechaVencimientoCuota != null) {
                if (producto.getFechaVencimientoCuota >= (fechaHoy.getMonth() && fechaHoy.getDay())) {
                    alert(`La fecha para pagar la cuota nro ${cantidadCuotasPagas + 1} de su articulo: ${producto.getNombre} vence hoy.`);
                }
            }
        }
    }

    // Metodo para ordenar los productos por precio ascendente o descendente.
    ordenarProductosPorPrecio(tipoOrden) {
        if (tipoOrden == 'asc') {
            this.productos.sort((a, b) => a.precio - b.precio);
        } else if (tipoOrden == 'desc') {
            this.productos.sort((a, b) => a.precio - b.precio);
            this.productos.reverse();
        } else {
            throw new Error(`No es posible ordenar por ${tipoOrden}.`);
        }
    }
}

// Fin declaración de Clases

// Sección para probar

let nombreUsuario = prompt("Ingrese su nombre...");
let title = document.getElementsByClassName("home__title");
title[0].textContent = `Bienvenido el día de hoy, ${nombreUsuario}!`;

let nombreProducto = prompt("Ingrese nombre de su producto.");
let precioProducto = parseFloat(prompt("Ingrese precio de su producto."));
let cantidadCuotas = parseInt(prompt("Ingrese la cantidad de cuotas."));
let fechaVencimientoCuota = new Date(2021, parseInt(prompt("Ingrese mes de vencimiento con un numero") - 1), parseInt(prompt("Ingrese dia de vencimiento con un numero")));

const inventario = new Inventario(parseInt(prompt("Ingrese el limite mensual de su tarjeta.")));

inventario.agregarProducto(new Producto(nombreProducto, precioProducto, cantidadCuotas, fechaVencimientoCuota));
inventario.agregarProducto(new Producto(nombreProducto + '2', precioProducto - 100, cantidadCuotas -10, fechaVencimientoCuota));
inventario.agregarProducto(new Producto(nombreProducto + '3', precioProducto + 5000, cantidadCuotas - 2, fechaVencimientoCuota));

inventario.borrarProducto(nombreProducto);

inventario.ordenarProductosPorPrecio("desc");

console.log(inventario.getProductos());

// Sección para probar