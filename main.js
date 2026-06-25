// OPjaguar Panel — Electron main process (con auto-actualización)
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

// Auto-actualización: la app se actualiza sola desde GitHub (como Apple/Android)
let autoUpdater = null;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (e) {
  // si electron-updater no está disponible, la app sigue funcionando normal
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0A0A0F',
    title: 'OPjaguar Panel',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('panel.html');
  Menu.setApplicationMenu(null);
  return win;
}

app.whenReady().then(() => {
  createWindow();

  // Revisar si hay actualización al abrir (silenciosamente)
  if (autoUpdater) {
    try {
      autoUpdater.checkForUpdatesAndNotify();

      // Cuando hay una versión nueva descargada, avisar y aplicar al reiniciar
      autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Actualización lista',
          message: 'Hay una versión nueva de OPjaguar Panel. Se aplicará al reiniciar la app.',
          buttons: ['Reiniciar ahora', 'Más tarde']
        }).then(result => {
          if (result.response === 0) autoUpdater.quitAndInstall();
        });
      });
    } catch (e) {
      // si falla la actualización, la app sigue funcionando con normalidad
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
