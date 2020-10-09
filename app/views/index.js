const { ipcRenderer, Main } = require('electron');
const products = document.querySelector('#products');

let productsList = [];
let getid = null

getProductList();

//resive new product from main.js
ipcRenderer.on('product:new', (e, newProduct) => {

    productsList.unshift(newProduct)
    localStorage.setItem('products', JSON.stringify(productsList))
    
    chargeProducts();
});

function getProductList(){
    productsList = localStorage.getItem('products');
    if(productsList == null){
        productsList = [];
    }else{
        productsList = JSON.parse(productsList);
    }

    chargeProducts();

    return productsList;
}

function chargeProducts(){
    products.innerHTML = '';

    for(let i= 0; i<productsList.length; i++){

        productsList[i].id = i
        localStorage.setItem('products', JSON.stringify(productsList))

        const newProductTemplate = `
            <div class="totalProduct">
                <div class="idProduct">
                    ${productsList[i].id}
                </div>
                <div class="nameProduct">
                    <h5>${productsList[i].name}</h5>
                </div>
                <div class="descriptionProduct">
                    ${productsList[i].description}
                </div>
                <div class="priceProduct" id="priceProduct">
                    $${productsList[i].price}
                </div>
                <button class="editButton" id="editProductButton">
                    Edit
                </button>               
                <button class="delateButton">
                    Delate
                </button>
            </div>
        `;
        products.innerHTML += newProductTemplate;
    }
    removeProduct()
    editProduct()
}

function removeProduct(){
    const delbtns = document.querySelectorAll('.delateButton');
    delbtns.forEach( btn => {
        btn.addEventListener('click', e => {

            let getid = e.target.parentElement
            getid = getid.querySelector('.idProduct').innerText;
            if (productsList.length == 1){
                productsList = []
                localStorage.setItem('products', JSON.stringify(productsList))
                chargeProducts()
            }else{
                productsList.splice( getid, 1 );
            
                chargeProducts();
            }
        });
    })
}

function editProduct(){
    const editbtns = document.querySelectorAll('.editButton');
    editbtns.forEach( btn => {
        btn.addEventListener('click', e => {

            getid = e.target.parentElement
            getid = getid.querySelector('.idProduct').innerText;
            localStorage.setItem('id', JSON.stringify(getid))

            //send edit window to main.js
            let editProductWindow
            ipcRenderer.send('window:edit', editProductWindow);       

            //resive product edited from main.js
            ipcRenderer.on('product:edit', (e, productEdited) => {

                productsList[getid].name = productEdited.name
                productsList[getid].price = productEdited.price
                productsList[getid].description = productEdited.description

                localStorage.setItem('products', JSON.stringify(productsList))
                chargeProducts();
            });
        })
    })
}