const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const url = require('url');
const path = require('path');

//Refresh automatically
if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}

let mainWindow;
let addProductWindow;

//Main window
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    });
});


//new window (add product)
function CreateAddProductWindow() {
    addProductWindow = new BrowserWindow({
        height: 550,
        width: 600,
        title: 'Add product',
        maximizable: false,
        minimizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    addProductWindow.setMenu(null);
    addProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/addProduct.html'),
        protocol: 'file',
        slashes: true
    }));
    addProductWindow.on('closed', () => {
        addProductWindow = null;
    });
}


//new window (edit product) 
ipcMain.on('window:edit', (editProductWindow) => {
        
    editProductWindow = new BrowserWindow({
        height: 550,
        width: 600,
        title: 'Edit product',
        maximizable: false,
        minimizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    editProductWindow.setMenu(null);
    editProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/editProduct.html'),
        protocol: 'file',
        slashes: true
    }));

    editProductWindow.on('closed', () => {
        editProductWindow = null;
    });
})


//resive from editProduct.js and send edit product to index.js
ipcMain.on('product:edit', (e, productEdited) => {
    mainWindow.webContents.send('product:edit', productEdited)
});


//resive from addProduct.js and send new product to index.js
ipcMain.on('product:new', (e, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct)
});


//Custom menu
const templateMenu = [
    {
        label: 'AddProduct',
        accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N',
        click(){
            CreateAddProductWindow();
        }
    }
]


//DevTools while developing
if(process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
        }
    })
}