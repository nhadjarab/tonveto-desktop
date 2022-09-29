const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { config } = require("dotenv");
const stripeSdk = require("stripe");
const electronDl = require("electron-dl");

app.disableHardwareAcceleration();
let win = null;

electronDl({
  onCompleted(data) {
    win.webContents.send("file-completed", data.path);
  },
  onCancel(item) {
    win.webContents.send("file-canceled", "item");
  },
  onProgress(data) {
    console.log(data);
    win.webContents.send("file-progressed",data.percent);
  },
  onStarted(item){
    win.webContents.send("file-started","item");
  }
});

config({
  path: path.join(__dirname, ".env"),
});

const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe = stripeSdk(STRIPE_KEY);

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      devTools: isDev,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize();
  win.show();

  if (isDev) win.webContents.openDevTools();
  else win.setMenuBarVisibility(false);

  const url = isDev
    ? "http://localhost:3000"
    : `file://${__dirname}/index.html`;

  win.loadURL(url);

  win.on("closed", () => {
    win = null;
  });

  const formateDate = (date) => {
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let dateOfMonth = date.getDate();
    if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
    const year = date.getFullYear();
    return dateOfMonth + "/" + month + "/" + year;
  };

  ipcMain.handle("getInvoices", async () => {
    const invoices = await stripe.invoices.list();
    return invoices.data.map((invoice) => ({
      id: invoice.id,
      client: invoice.customer_name,
      email: invoice.customer_email,
      price: parseInt(invoice.amount_paid) / 100 + "€",
      pdf: invoice.invoice_pdf,
      description: invoice.lines.data[0].description,
      startDate: formateDate(
        new Date(parseInt(invoice.lines.data[0].period.start) * 1000)
      ),
      endDate: formateDate(
        new Date(parseInt(invoice.lines.data[0].period.end) * 1000)
      ),
    }));
  });

  ipcMain.handle("getSubscriptions", async () => {
    const subscriptions = await stripe.subscriptions.list({
      status: "all",
    });
    const populatedSubscriptions = await Promise.all(
      subscriptions.data.map(async (subscription) => {
        const customer = await stripe.customers.retrieve(subscription.customer);
        let product;
        if (subscription.items?.data[0]?.plan?.product)
          try {
            product = await stripe.products.retrieve(
              subscription.items?.data[0]?.plan?.product
            );
          } catch (err) {
            console.error(err);
          }
        return {
          id: subscription.id,
          status: subscription.status,
          created: formateDate(new Date(parseInt(subscription.created) * 1000)),
          client: customer.name,
          email: customer.email,
          product: product?.name,
          billing: subscription.collection_method,
        };
      })
    );
    return populatedSubscriptions;
  });

  ipcMain.handle("CancelSubscription", async (_event, subscription) => {
    const deleted = await stripe.subscriptions.del(subscription);
    console.log(deleted);
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
