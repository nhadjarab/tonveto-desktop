const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

app.disableHardwareAcceleration();
let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:800,
    minHeight : 600,
    icon : __dirname + "/favicon.ico" ,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      devTools: !app.isPackaged
    },
  });

  const url = isDev
    ? "http://localhost:3000"
    : path.join(__dirname, "../build/index.html");
  win.loadURL(url);

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

process.on("warning", (err) => console.error(err));
