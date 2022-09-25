import { Outlet } from "react-router-dom";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

import Logout from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";

const theme = createTheme({
  palette: {
    primary: {
      main: "#555fdd",
    },
  },
});

const AuthLayout = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const logout = () => {
    loginUser(null, () => navigate("/"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="absolute" sx={{ backgroundColor: "#fff" }}>
        <Box px={3}>
          <Toolbar>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="secondary"
              sx={{ flexGrow: 1 }}
            >
              Tonveto
            </Typography>
            <IconButton size="small" sx={{ ml: 2 }} component={Link} to="/home">
              <span style={{ marginRight: "7px" }}>Users</span> <GroupIcon />
            </IconButton>
            <IconButton size="small" sx={{ ml: 2 }} component={Link} to="/vets">
              <span style={{ marginRight: "7px" }}>Vets</span> <GroupIcon />
            </IconButton>
            <IconButton size="small" sx={{ ml: 2 }} component={Link} to="/clinics">
              <span style={{ marginRight: "7px" }}>Clinics</span> <GroupIcon />
            </IconButton>
            <IconButton size="small" sx={{ ml: 2 }} component={Link} to="/appointements">
              <span style={{ marginRight: "7px" }}>Appointements</span> <GroupIcon />
            </IconButton>
            <IconButton size="small" sx={{ ml: 2 }} onClick={logout}>
              <span style={{ marginRight: "7px" }}>Logout</span>
              <Logout />
            </IconButton>
          </Toolbar>
        </Box>
      </AppBar>
      <Container sx={{ mt: 15, mb: 5,padding:4 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default AuthLayout;
