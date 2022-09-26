const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  apiUrl: process.env.API_BASE_URL,
  getInvoices: () => ipcRenderer.invoke("getInvoices"),
});
