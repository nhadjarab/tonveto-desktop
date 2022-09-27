const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  apiUrl: process.env.API_BASE_URL || "https://vetolib-backend-production.up.railway.app",
  getSubscriptions: () => ipcRenderer.invoke("getSubscriptions"),
});
