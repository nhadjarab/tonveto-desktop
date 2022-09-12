const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  auth: {
    signIn(user) {
      return ipcRenderer.invoke("login", user);
    },
  },
});
