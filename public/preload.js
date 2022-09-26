const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  apiUrl: process.env.API_BASE_URL || "https://vetolib-backend-production.up.railway.app",
  getInvoices: () => ipcRenderer.invoke("getInvoices"),
});
