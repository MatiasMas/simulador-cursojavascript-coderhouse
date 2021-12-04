// Classes Declaration - START

class Product {
    static productsCounter = 0;

    constructor(name, category, price, installmentsQuantity, installmentExpirationDate, paidInstallments, paid, expiredInstallment) {
        this.id = ++Product.productsCounter;
        this.name = name;
        this.productCategory = category;
        this.price = parseInt(price);
        this.installmentsQuantity = installmentsQuantity;
        this.installmentExpirationDate = new Date(installmentExpirationDate);
        this.paidInstallments = paidInstallments;
        this.paid = paid;
        this.expiredInstallment = expiredInstallment;
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

    getProductCategory() {
        return this.productCategory;
    }

    setProductCategory(category) {
        this.productCategory = category;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = parseInt(price);
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
    addIVA() {
        this.price *= 1.22;
    }

    // Method that given certain amount and an installment number, calculate each installment amount
    calculateInstallmentValue() {
        return (this.price / this.installmentsQuantity).toFixed(2);
    }

    // Increment 1 to the product's paid installments
    payInstallment() {
        if (this.paidInstallments !== this.installmentsQuantity) {
            this.paidInstallments = this.paidInstallments + 1;
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

        if (product.getExpiredInstallment()) {
            $('.home__main__products__expired-products').append(
                `
            <div id="${product.getId()}" class="product-${product.getId()} product card hvr-shadow" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#productModal">
                <img class="product__img card-img-top" src="images/${product.getProductCategory()}.png" alt="product-icon">
                <img class="product__close" src="images/cancelButton.png" alt="delete-icon">
                <div class="product__info card-body">
                    <h5 class="card-title">${product.getName()}</h5>
                </div>
                <ul class="product__info list-group list-group-flush">
                    <li class="product__info--price list-group-item">Precio: $${product.getPrice()}</li>
                    <li class="product__info--monthlyFee list-group-item">Monto Cuota: $${product.calculateInstallmentValue()}</li>
                    <li class="product__info--feeNumber list-group-item">Nro Cuotas: ${product.getPaidInstallments()}/${product.getInstallmentsQuantity()}</li>
                </ul>
            </div>
            `
            );
        } else if (product.isPaid()) {
            $('.home__main__products__paid-products').append(
                `
            <div id="${product.getId()}" class="product-${product.getId()} product card hvr-shadow" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#productModal">
                <img class="product__img card-img-top" src="images/${product.getProductCategory()}.png" alt="product-icon">
                <img class="product__close" src="images/cancelButton.png" alt="delete-icon">
                <div class="product__info card-body">
                    <h5 class="card-title">${product.getName()}</h5>
                </div>
                <ul class="product__info list-group list-group-flush">
                    <li class="product__info--price list-group-item">Precio: $${product.getPrice()}</li>
                    <li class="product__info--monthlyFee list-group-item">Monto Cuota: $${product.calculateInstallmentValue()}</li>
                    <li class="product__info--feeNumber list-group-item">Nro Cuotas: ${product.getPaidInstallments()}/${product.getInstallmentsQuantity()}</li>
                </ul>
            </div>
            `
            );
        } else {
            $('.home__main__products').append(
                `
            <div id="${product.getId()}" class="product-${product.getId()} product card hvr-shadow" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#productModal">
                <img class="product__img card-img-top" src="images/${product.getProductCategory()}.png" alt="product-icon">
                <img class="product__close" src="images/cancelButton.png" alt="delete-icon">
                <div class="product__info card-body">
                    <h5 class="card-title">${product.getName()}</h5>
                </div>
                <ul class="product__info list-group list-group-flush">
                    <li class="product__info--price list-group-item">Precio: $${product.getPrice()}</li>
                    <li class="product__info--monthlyFee list-group-item">Monto Cuota: $${product.calculateInstallmentValue()}</li>
                    <li class="product__info--feeNumber list-group-item">Nro Cuotas: ${product.getPaidInstallments()}/${product.getInstallmentsQuantity()}</li>
                </ul>
            </div>
            `
            );
        }

        updateProductsTotalValue();
        updateNumberOfProductsToBePaid();

        document.getElementById(`${product.getId()}`).classList.add('magictime', 'swashIn');
        setTimeout(function () {
            document.getElementById(`${product.getId()}`).classList.remove('magictime', 'swashIn');
        }, 501);
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

    calculateNumberOfProductsToBePaid() {
        let productsToBePaid = 0;
        for (const product of this.products) {
            if (!product.isPaid()) {
                productsToBePaid++;
            }
        }

        return productsToBePaid;
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

const checkAddProductFormFieldsValues = () => {
    let productName = $('#productNameInput')[0].value;
    let productPrice = $('#productPriceInput')[0].value;
    let installmentsQuantity = $('#installmentQuantityInput')[0].value;
    let installmentExpirationDate = $('#installmentExpirationDate')[0].value;

    if (productName != '' && productPrice != '' && installmentsQuantity != '' && installmentExpirationDate != '') {
        return true;
    } else {
        return false;
    }
}

const checkCreditLimitFormFieldsValues = () => {
    let newLimit = $('#newLimitInput')[0].value;

    if (newLimit != '') {
        return true;
    } else {
        return false;
    }
}

const disableAddProductSubmitButtonOnInputChange = (locator) => {
    $(`#${locator}`).on('input change', () => {
        if (checkAddProductFormFieldsValues()) {
            $('#addProductSubmitButton').prop('disabled', false);
        } else {
            $('#addProductSubmitButton').prop('disabled', true);
        }
    });
}

const disableCreditLimitSubmitButtonOnInputChange = (locator) => {
    $(`#${locator}`).on('input change', () => {
        if (checkCreditLimitFormFieldsValues()) {
            $('#setLimitSubmitButton').prop('disabled', false);
        } else {
            $('#setLimitSubmitButton').prop('disabled', true);
        }
    });
}

const updateProductsTotalValue = () => {
    $('#total-display')[0].textContent = `Products Total Value: $${parseInt(inventory.calculateProductsTotalValue())}`
}

const updateCreditCardLimit = () => {
    $('#card-limit-display')[0].textContent = `$${parseInt(inventory.getCreditCardLimit())}`
}

const updateNumberOfProductsToBePaid = () => {
    $('#number-display')[0].textContent = `${parseInt(inventory.calculateNumberOfProductsToBePaid())}`
}

// Utility Methods - END

// Events Handler - START

$('#addProductModal').on('hidden.bs.modal', () => {
    $('#productNameInput')[0].value = '';
    $('#categorySelector')[0].value = 'none';
    $('#productPriceInput')[0].value = '';
    $('#installmentQuantityInput')[0].value = '';
    $('#installmentExpirationDate')[0].value = '';

    $('#addProductSubmitButton').prop('disabled', true);
});

$('#setLimitModal').on('hidden.bs.modal', () => {
    $('#newLimitInput')[0].value = '';

    $('#setLimitSubmitButton').prop('disabled', true);
});

disableCreditLimitSubmitButtonOnInputChange('newLimitInput');
disableAddProductSubmitButtonOnInputChange('productNameInput');
disableAddProductSubmitButtonOnInputChange('productPriceInput');
disableAddProductSubmitButtonOnInputChange('installmentQuantityInput');
disableAddProductSubmitButtonOnInputChange('installmentExpirationDate');

$('#addProductSubmitButton').click(() => {
    let productName = $('#productNameInput')[0].value;
    let productCategory = $('#categorySelector')[0].value;
    let productPrice = $('#productPriceInput')[0].value;
    let installmentsQuantity = $('#installmentQuantityInput')[0].value;
    let installmentExpirationDate = $('#installmentExpirationDate')[0].value;

    inventory.addProduct(new Product(productName, productCategory, productPrice, installmentsQuantity, installmentExpirationDate, 0, false, false));

    const closeButtons = $('.product__close');

    for (const closeButton of closeButtons) {
        closeButton.addEventListener('click', () => {
            let parentId = parseInt(closeButton.parentNode.id);
            let elem = $(`#${parentId}`)[0];
            elem.classList.add('magictime', 'swashOut');
            setTimeout(() => {
                elem.parentNode.removeChild(elem);
                inventory.deleteProduct(parentId);
                updateProductsTotalValue();
                updateNumberOfProductsToBePaid();
            }, 500);
        });
    }

});

$('#setLimitSubmitButton').click(() => {
    let newLimit = $('#newLimitInput')[0].value;

    inventory.setCreditCardLimit(newLimit);
    updateCreditCardLimit();
});

$('#productModal').on('shown.bs.modal', (event) => {

    let product = inventory.searchProductById(parseInt(event.relatedTarget.id));

    $('#productInformation').html(
        `
        <div class="mb-3">
            <label for="product${product.getId()}NameInput" class="form-label">Product Name</label>
            <input type="text" class="form-control" id="product${product.getId()}NameInput" aria-describedby="productName">
        </div>
        <div class="mb-3">
            <label for="category${product.getId()}Selector" class="form-label">Product Category</label>
            <select id="category${product.getId()}Selector" class="form-select" aria-label="Default select example">
                <option value="none" disabled>Select a category...</option>
                <option value="cloth">Cloth</option>
                <option value="shoes">Shoes</option>
                <option value="electronics">Electronics</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="product${product.getId()}PriceInput" class="form-label">Product Price</label>
            <input type="number" class="form-control" id="product${product.getId()}PriceInput">
        </div>
        <div class="mb-3">
            <label for="installment${product.getId()}QuantityInput" class="form-label">Installment Quantity</label>
            <input type="number" class="form-control" id="installment${product.getId()}QuantityInput">
        </div>
        <div class="mb-3">
            <label for="installment${product.getId()}ExpirationDate" class="form-label">Installment Expiration Date</label>
            <input type="date" class="form-control" id="installment${product.getId()}ExpirationDate">
        </div>
        `
    );

    $(`#product${product.getId()}NameInput`)[0].value = product.getName();
    $(`#category${product.getId()}Selector`)[0].value = product.getProductCategory();
    $(`#product${product.getId()}PriceInput`)[0].value = product.getPrice();
    $(`#installment${product.getId()}QuantityInput`)[0].value = product.getInstallmentsQuantity();
    $(`#installment${product.getId()}ExpirationDate`)[0].valueAsDate = product.getInstallmentExpirationDate();

    $('#updateProductSubmit').click(() => {
        product.setName($(`#product${product.getId()}NameInput`)[0].value);
        product.setProductCategory($(`#category${product.getId()}Selector`)[0].value);
        product.setPrice($(`#product${product.getId()}PriceInput`)[0].value);
        product.setInstallmentsQuantity($(`#installment${product.getId()}QuantityInput`)[0].value);
        product.setInstallmentExpirationDate(new Date($(`#installment${product.getId()}ExpirationDate`)[0].value));
        $(`#${product.getId()} .card-title`)[0].textContent = `${product.getName()}`;
        $(`#${product.getId()} ul li`)[0].textContent = `Precio: $${product.getPrice()}`;
        $(`#${product.getId()} ul li`)[1].textContent = `Monto Cuota: $${product.calculateInstallmentValue()}`;
        $(`#${product.getId()} ul li`)[2].textContent = `Nro Cuotas: ${product.getPaidInstallments()}/${product.getInstallmentsQuantity()}`;

        updateProductsTotalValue();
    });

    $('#payInstallment').click(() => {
        product.payInstallment();
        $(`#${product.getId()} ul li`)[2].textContent = `Nro Cuotas: ${product.getPaidInstallments()}/${product.getInstallmentsQuantity()}`;
    });

});

// Events Handler - END

// Test Section - START

let masterDate = new Date('2022-01-1');

$('.home__main--title').hide().fadeIn('slow');

const inventory = new Inventory(1000);

$.getJSON('../resources/products.json', (products) => {
    for (const product of products) {
        inventory.addProduct(new Product(product.name, product.productCategory, product.price, product.installmentsQuantity, product.installmentExpirationDate, product.paidInstallments, product.paid, product.expiredInstallment));

        const closeButtons = $('.product__close');

        for (const closeButton of closeButtons) {
            closeButton.addEventListener('click', () => {
                let parentId = parseInt(closeButton.parentNode.id);
                let elem = $(`#${parentId}`)[0];
                elem.classList.add('magictime', 'swashOut');
                setTimeout(function () {
                    elem.parentNode.removeChild(elem);
                    inventory.deleteProduct(parentId);
                    updateProductsTotalValue();
                    updateNumberOfProductsToBePaid();
                }, 500);
            });
        }

        updateProductsTotalValue();
        updateNumberOfProductsToBePaid();
    }
});

// Test Section - END