const { ipcMain } = require("electron");
const { login } = require("./database.js");

const launchApi = () => {
  ipcMain.handle("login", async (event, { username, password }) => {
    const result = await login(username, password);
    return result;
  });
};

module.exports = launchApi;
