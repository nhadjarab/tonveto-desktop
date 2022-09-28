const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  apiUrl: process.env.API_BASE_URL,
  getInvoices: () => ipcRenderer.invoke("getInvoices"),
  getSubscriptions: () => ipcRenderer.invoke("getSubscriptions"),
  CancelSubscription: (subscription) => ipcRenderer.invoke("CancelSubscription",subscription),
});
