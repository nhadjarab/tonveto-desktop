const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { config } = require("dotenv");
const stripeSdk = require("stripe");
const electronDl = require("electron-dl");

electronDl({
  openFolderWhenDone: true,
});

config();

const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe = stripeSdk(STRIPE_KEY);

app.disableHardwareAcceleration();
let win = null;

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
    : path.join(__dirname, "../build/index.html");
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

  ipcMain.handle("getSubscriptions", async () => {
    const invoices = await stripe.invoices.list({
      status: "paid",
    });
    return invoices.data.map((invoice) => ({
      id: invoice.id,
      name: invoice.customer_name,
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

  // ipcMain.handle("getStripeSubscriptions", async () => {
  //   const subscriptions = await stripe.subscriptions.list();
  //   const populatedSubscriptions = await Promise.all(
  //     subscriptions.data.map(async (subscription) => {
  //       const customer = await stripe.customers.retrieve(subscription.customer);
  //       let product;
  //       if (subscription.items?.data?.plan?.product)
  //         product = await stripe.products.retrieve(
  //           subscription.items?.data?.plan?.product
  //         );
  //       return {
  //         currency: subscription.currency,
  //         status: subscription.status,
  //         price: subscription.items?.data?.plan?.amount
  //           ? parseInt(subscription.items?.data?.plan?.amount)
  //           : 0,
  //         end_date: new Date(parseInt(subscription.current_period_end) * 1000),
  // start_date: new Date(
  //   parseInt(subscription.current_period_start) * 1000
  // ),
  //         customer: { name: customer.name, email: customer.email },
  //         productName: product?.name,
  //         productDescription: product?.description,
  //       };
  //     })
  //   );
  //   console.log(populatedSubscriptions);
  //   return populatedSubscriptions;
  // });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

process.on("warning", (err) => console.error(err));
