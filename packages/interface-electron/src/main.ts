import { app, BrowserWindow, globalShortcut, Menu } from 'electron';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
  });
  if (process.env.NODE_ENV === 'development') {
    win.loadURL(`http://localhost:4444/`);
  } else {
    win.loadURL(`https://bosens-china.github.io/picture-bed`);
  }

  return win;
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const mainWindow = createWindow();
  if (process.env.NODE_ENV === 'development') {
    globalShortcut.register('F12', () => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools();
      }
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
