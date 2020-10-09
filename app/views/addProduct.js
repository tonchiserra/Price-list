const { ipcRenderer } = require('electron');
const form = document.querySelector('form');

//create a new product
form.addEventListener('submit', e => {

    var nameProduct = document.querySelector('#name').value;
    var priceProduct = document.querySelector('#price').value;
    var descriptionProduct = document.querySelector('#description').value;

    const newProduct = {
        name: nameProduct,
        price: priceProduct,
        description: descriptionProduct,
        id: null
    };

    //send new product to main.js
    ipcRenderer.send('product:new', newProduct)    
});