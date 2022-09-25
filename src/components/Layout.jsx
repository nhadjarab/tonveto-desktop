import { Outlet } from "react-router-dom";
import {CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#555fdd",
    },
  },
});

const Layout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
