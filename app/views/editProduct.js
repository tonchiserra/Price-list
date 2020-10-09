const { ipcRenderer } = require('electron');
const totalForm = document.querySelector('#totalForm');


//show data in inputs
let getid = localStorage.getItem('id')
getid = JSON.parse(getid)
let productList = localStorage.getItem('products')
productList = JSON.parse(productList)

const editProductTemplate = `
    <div class="formGroup">
        <input type="text" id="name" class="inputForm" placeholder="Product's Name" value="${productList[getid].name}" autofocus>
    </div>
    <div class="formGroup">
        <input type="text" id="price" class="inputForm" placeholder="Price" value="${productList[getid].price}">
    </div>
    <div class="formGroup">
        <input type="text" id="description" class="inputForm" placeholder="Description" value="${productList[getid].description}">
    </div>
    <button class="acceptButton" onclick="closeWindow()">
        Accept
    </button>
`;
totalForm.innerHTML += editProductTemplate;


//send product edited to main.js
const form = document.querySelector('form');
form.addEventListener('submit', e => {

    var nameProduct = document.querySelector('#name').value;
    var priceProduct = document.querySelector('#price').value;
    var descriptionProduct = document.querySelector('#description').value;

    const productEdited = {
        name: nameProduct,
        price: priceProduct,
        description: descriptionProduct,
        id: null
    };

    ipcRenderer.send('product:edit', productEdited)    
});