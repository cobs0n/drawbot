/* 
$$$$$$$\                                   $$$$$$$\             $$\     
$$  __$$\                                  $$  __$$\            $$ |    
$$ |  $$ | $$$$$$\  $$$$$$\  $$\  $$\  $$\ $$ |  $$ | $$$$$$\ $$$$$$\   
$$ |  $$ |$$  __$$\ \____$$\ $$ | $$ | $$ |$$$$$$$\ |$$  __$$\\_$$  _|  
$$ |  $$ |$$ |  \__|$$$$$$$ |$$ | $$ | $$ |$$  __$$\ $$ /  $$ | $$ |    
$$ |  $$ |$$ |     $$  __$$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ | $$ |$$\ 
$$$$$$$  |$$ |     \$$$$$$$ |\$$$$$\$$$$  |$$$$$$$  |\$$$$$$  | \$$$$  |
\_______/ \__|      \_______| \_____\____/ \_______/  \______/   \____/

By cobs0n
*/


const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const Jimp = require('jimp');
const fs = require('fs');
const os = require('os');

let lastImagePosition = null;
let lastImageSize = null;
let image_data = null;
let running = false;
let pythonProcess = null
function draw_img(width, height, left, top, path) {
    return new Promise((resolve, reject) => {
        pythonProcess = spawn('draw.exe', [width, height, left, top, path]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });
    });
}
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'draw-brush.svg'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: false
        },
        transparent: true,
        frame: false,
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

ipcMain.on('close-window', () => {
    if (mainWindow) {
        mainWindow.close();
    }
});
ipcMain.on('minimize-window', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

ipcMain.on('read-info', (event, config) => {
    lastImagePosition = config.lastImagePosition;
    lastImageSize = config.lastImageSize;
});

ipcMain.on('read-img', (event, imageData) => {
    image_data = imageData
});
app.whenReady().then(() => {
    createWindow();

    globalShortcut.register('Y', async () => {
        if (lastImagePosition && lastImageSize && image_data) {
            if (mainWindow) {
                mainWindow.minimize();
            }
            try {
                const image = await Jimp.read(Buffer.from(image_data.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
                image.resize(parseInt(lastImageSize.width), parseInt(lastImageSize.height));
                const tempDir = os.tmpdir();
                const imagePath = path.join(tempDir, `image_${lastImageSize.width}x${lastImageSize.height}_${Date.now()}.jpg`);
                await image.writeAsync(imagePath); 
                draw_img(parseInt(lastImageSize.width), parseInt(lastImageSize.height), parseInt(lastImagePosition.left), parseInt(lastImagePosition.top), imagePath);
            } catch (error) {
                console.error('Error reading image:', error);
            }
        }
    });


    globalShortcut.register('U', () => {
        running = false
        if (pythonProcess) {
            pythonProcess.kill();
        }
    });


    globalShortcut.register('X', async () => {
        if (mainWindow) {
            mainWindow.close();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
