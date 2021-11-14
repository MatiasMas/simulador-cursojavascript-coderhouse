// Classes Declaration - START

class Product {
    static productsCounter = 0;

    constructor(name, price, installmentsQuantity, installmentExpirationDate) {
        this.id = ++Product.productsCounter;
        this.name = name;
        this.price = price;
        this.installmentsQuantity = installmentsQuantity;
        this.installmentExpirationDate = new Date(installmentExpirationDate);
        this.paidInstallments = 0;
        this.paid = false;
        this.expiredInstallment = false;
    }

    // Getters y setters.

    getId() {
        return this.id;
    }

    getName() {
        return this.name.toLowerCase();
    }

    setName(name) {
        this.name = name;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

    getInstallmentsQuantity() {
        return this.installmentsQuantity;
    }

    setInstallmentsQuantity(installmentsQuantity) {
        this.installmentsQuantity = installmentsQuantity;
    }

    getPaidInstallments() {
        return this.paidInstallments;
    }

    isPaid() {
        return this.paid;
    }

    getInstallmentExpirationDate() {
        return this.installmentExpirationDate;
    }

    setInstallmentExpirationDate(installmentExpirationDate) {
        this.installmentExpirationDate = installmentExpirationDate;
    }

    getExpiredInstallment() {
        return this.expiredInstallment;
    }

    // Adds IVA in case that the products are managed as cost price
    addIVA(){
        this.price *= 1.22;
    }

    // Method that given certain amount and an installment number, calculate each installment amount
    calculateInstallmentValue() {
        return (this.price / this.installmentsQuantity).toFixed(2);
    }

    // Increment 1 to the product's paid installments
    payInstallment() {
        if (this.paidInstallments !== this.installmentsQuantity) {
            this.paidInstallments++;
        } else {
            throw new Error("Todas las cuotas ya estan pagas.");
        }
    }

    // Method that transition a product state from paying to paid, this is done through the user interface
    transitionToPaid() {
        this.paid = true;
        this.installmentExpirationDate = null;
    }

    // If an installment expiration date is met, the product transition to expired
    transitionToExpired() {
        this.expiredInstallment = true;
    }

}

class Inventory {
    constructor(creditCardLimit) {
        this.products = [];
        this.creditCardLimit = creditCardLimit;
        this.productsTotalValue = 0;
    }

    // Getters y setters 

    getProducts() {
        return this.products;
    }

    getCreditCardLimit() {
        return this.creditCardLimit;
    }

    setCreditCardLimit(creditCardLimit) {
        this.creditCardLimit = creditCardLimit;
    }

    getProductsTotalValue() {
        return this.productsTotalValue;
    }
    
    // Creates and add a product to the inventory
    addProduct(product) {
        this.products.push(product);
        localStorage.setItem('products', JSON.stringify(this.products));

        $('.home__main__products').append(
            `
            <div id="${product.getId()}" class="product-${product.getId()} product">
                <img class="product__img" src="images/sneakers.png" alt="product-icon">
                <img class="product__close" src="images/cancelButton.png" alt="delete-icon">
                <div class="product__info">
                    <p class="product__info--title">${product.getName()}</p>
                    <p class="product__info--price">Precio: ${product.getPrice()}</p>
                    <p class="product__info--monthlyFee">Monto Cuota: ${product.calculateInstallmentValue()}</p>
                    <p class="product__info--feeNumber">Nro Cuotas: ${product.getInstallmentsQuantity()}</p>
                </div>
            </div>
            `
        );

        $(`#${product.getId()}`)
            .hide()
            .fadeIn('slow')
            .animate({
                opacity: 0.5,
                height: "+=20",
                width: "+=20"
            }, 1000, () => {
                $(`#${product.getId()}`)
                    .animate({
                        opacity: 1,
                        height: "-=20",
                        width: "-=20"
                    }, 1000, () => {})
            });
    }

    // Deletes a product from the inventory
    deleteProduct(id) {
        const product = this.searchProductById(id);
        let index = this.products.indexOf(product);

        this.products.splice(index, 1);
        localStorage.removeItem('products');
        localStorage.setItem('products', JSON.stringify(this.products));
        Product.productsCounter--;
    }

    // Search a product by ID
    searchProductById(id) {

        const product = this.products.find(product => product.getId() === id);

        if (product == null) {
            throw new Error(`El producto con id: ${product.getId()} no existe en el inventario.`);
        }

        return product;
    }

    // Method that sum all the installment values to paid on the next month, and it validates that the credit card limit is not being surpassed
    calculateCreditCardMonthlyPayment() {
        let valueToPayNextMonth = 0;
        for (let i = 0; i < this.products.length; i++) {
            if (!this.products[i].isPaid()) {
                valueToPayNextMonth += this.products[i].calculateInstallmentValue();
            }
        }

        return valueToPayNextMonth;
    }

    // Method that sum and return all the products prices so the user can see how much does it have to pay
    calculateProductsTotalValue() {
        let productsTotalValue = 0;
        for (let i = 0; i < this.products.length; i++) {
            if (!this.products[i].isPaid()) {
                productsTotalValue += this.products[i].getPrice();
            }
        }

        return productsTotalValue;
    }

    // This method send a fictitious sms to the user indicating that a product is close to expire
    installmentCloseToExpireWarning() {
        for (const product of this.products) {
            let todayDate = new Date();
            if (product.installmentExpirationDate != null) {
                if (product.getInstallmentExpirationDate() >= (todayDate.getMonth() && todayDate.getDay())) {
                    alert(`La fecha para pagar la cuota nro ${product.paidInstallments + 1} de su articulo: ${product.getName()} vence hoy.`);
                }
            }
        }
    }

    // Method to order products by ascendant or descendent price
    orderProductsByPrice(orderBy) {
        if (orderBy === 'asc') {
            this.products.sort((a, b) => a.price - b.price);
        } else if (orderBy === 'desc') {
            this.products.sort((a, b) => a.price - b.price);
            this.products.reverse();
        } else {
            throw new Error(`No es posible ordenar por ${orderBy}.`);
        }
    }
}

// Classes Declaration - END

// Utility Methods - START

const checkFormFieldsValues = () => {
    let productName = $('#productNameInput')[0].value;
    let productPrice = $('#productPriceInput')[0].value;
    let installmentsQuantity = $('#installmentQuantityInput')[0].value;
    let installmentExpirationDate = $('#installmentExpirationDate')[0].value;

    if (productName != '' && productPrice != '' && installmentsQuantity != '' && installmentExpirationDate != ''){
        return true;
    } else {
        return false;
    }
}

const disableSubmitButtonOnInputChange = (locator) => {
    $(`#${locator}`).on('input change', () => {
        if (checkFormFieldsValues()){
            $('#addProductSubmitButton').prop('disabled', false);
        } else {
            $('#addProductSubmitButton').prop('disabled', true);
        }
    });
}

// Utility Methods - END

// Events Handler - START

$('#addProductModal').on('hidden.bs.modal', () => {
    $('#productNameInput')[0].value = '';
    $('#productPriceInput')[0].value = '';
    $('#installmentQuantityInput')[0].value = '';
    $('#installmentExpirationDate')[0].value = '';

    $('#addProductSubmitButton').prop('disabled', true);
});

disableSubmitButtonOnInputChange('productNameInput');
disableSubmitButtonOnInputChange('productPriceInput');
disableSubmitButtonOnInputChange('installmentQuantityInput');
disableSubmitButtonOnInputChange('installmentExpirationDate');

$('#addProductSubmitButton').click(() => {
    let productName = $('#productNameInput')[0].value;
    let productPrice = $('#productPriceInput')[0].value;
    let installmentsQuantity = $('#installmentQuantityInput')[0].value;
    let installmentExpirationDate = $('#installmentExpirationDate')[0].value;

    inventory.addProduct(new Product(productName, productPrice, installmentsQuantity, installmentExpirationDate));

    const closeButtons = $('.product__close');

    for (const closeButton of closeButtons) {
        closeButton.addEventListener('click', () => {
            let parentId = parseInt(closeButton.parentNode.id);
            let elem = $(`#${parentId}`)[0];
            elem.parentNode.removeChild(elem);
            inventory.deleteProduct(parentId);
        });
    }

});

// Events Handler - END

// Test Section - START

let userName = prompt("Ingrese su nombre...");
let title = $(".home__main--title")[0];
title.textContent = `Bienvenido el día de hoy, ${userName}!`;

$('.home__main--title').hide().fadeIn('slow');

// const inventory = new Inventory(parseInt(prompt("Ingrese el limite mensual de su tarjeta.")));
const inventory = new Inventory(1000);

// Test Section - END