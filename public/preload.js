const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  apiUrl: process.env.API_BASE_URL,
  getInvoices: () => ipcRenderer.invoke("getInvoices"),
  getSubscriptions: () => ipcRenderer.invoke("getSubscriptions"),
  getCanceledSubscriptions: () => ipcRenderer.invoke("getCanceledSubscriptions"),
  pauseSubscription: (subscription) =>
    ipcRenderer.invoke("pauseSubscription", subscription),
  cancelSubscription: (subscription) =>
    ipcRenderer.invoke("cancelSubscription", subscription),
  reactivateSubscription: (subscription) =>
    ipcRenderer.invoke("reactivateSubscription", subscription),
  onDownloadCompleted: (setMessage, setType) => {
    ipcRenderer.on("file-completed", (_event, path) => {
      setMessage("Téléchargement terminé ... Lien : " + path);
      setType("success");
    });
  },
  onDownloadCanceled: (setMessage, setType) => {
    ipcRenderer.on("file-canceled", (_event, item) => {
      setMessage("Téléchargement annulé");
      setType("error");
    });
  },
  onDownloadStarted: (setMessage, setType) => {
    ipcRenderer.on("file-started", (_event, item) => {
      console.log(item)
      setMessage("Le téléchargement a commencé ... ");
      setType("info");
    });
  },
  onDownloadProgressing: (setMessage, setType) => {
    ipcRenderer.on("file-progressed", (_event, percent) => {
      setMessage(
        "Votre fichier est en cours de téléchargement ... " +
          parseInt(percent) * 100 +
          "%"
      );
      setType("info");
    });
  },
});
