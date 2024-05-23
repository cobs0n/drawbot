const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    closeCurrentWindow: () => ipcRenderer.send('close-window'),
    minimizeCurrentWindow: () => ipcRenderer.send('minimize-window'),
    sendInfo: (data) => ipcRenderer.send('read-info', data),
    sendImg: (data) => ipcRenderer.send('read-img', data)

});
