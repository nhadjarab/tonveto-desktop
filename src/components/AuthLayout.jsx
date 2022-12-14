import { useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import {
  AppBar,
  CssBaseline,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  Toolbar,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../context/AuthProvider";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logout from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import MedicationIcon from "@mui/icons-material/Medication";
import GiteIcon from "@mui/icons-material/Gite";
import EventIcon from "@mui/icons-material/Event";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import DescriptionIcon from "@mui/icons-material/Description";
import EuroIcon from "@mui/icons-material/Euro";
import AppLogo from "../assets/favicon.png";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: {
      main: "#222f3e",
    },
  },
});

const AuthLayout = () => {
  const navigate = useNavigate();
  const { user, loginUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    loginUser(null, () => navigate("/"));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#fff",
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Box px={3}>
            <Toolbar>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ flexGrow: 1, color: "#222f3e" }}
              >
                Tonveto
              </Typography>
              <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar
                  sx={{ width: 40, height: 40, backgroundColor: "#222f3e" }}
                >
                  {user.username[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    padding: "8px 10px",
                    borderRadius: "7px",
                    minWidth: "200px",
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 20,
                      height: 20,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 12,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div style={{ paddingLeft: "10px", marginBottom: "8px" }}>
                  <Typography variant="h6" fontSize={16}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                </div>
                <MenuItem component={Link} to="/profile">
                  <ListItemIcon>
                    <AccountCircleIcon/>
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Se D??connecter
                </MenuItem>
              </Menu>
            </Toolbar>
          </Box>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            backgroundColor: "#6F1E51",
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#222f3e",
              color: "#ddd",
            },
          }}
        >
          <Toolbar>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                margin: "30px auto 5px",
              }}
              src={AppLogo}
            />
          </Toolbar>

          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListSubheader
                inset
                sx={{ backgroundColor: "#222f3e", color: "#fff" }}
              >
                General
              </ListSubheader>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/home">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Utilisateurs" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/vets">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <MedicationIcon />
                  </ListItemIcon>
                  <ListItemText primary="V??t??rinaires" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/clinics">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <GiteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cliniques" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/appointements">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText primary="Rendez-vous" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ backgroundColor: "#aaa" }} />
            <List>
              <ListSubheader
                inset
                sx={{ backgroundColor: "#222f3e", color: "#fff" }}
              >
                Gestion
              </ListSubheader>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/pending/vets">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <HourglassBottomIcon />
                  </ListItemIcon>
                  <ListItemText primary="V??t??rinaires en attente" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/pending/clinics">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <HourglassBottomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cliniques en attente" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/comment-reports">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <ChatBubbleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Commentaires" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/subscriptions">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <EuroIcon />
                  </ListItemIcon>
                  <ListItemText primary="Abonnement" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/invoices">
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Factures" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ backgroundColor: "#aaa" }} />
            <List>
              {" "}
              <ListItem disablePadding>
                <ListItemButton component={Button} onClick={logout}>
                  <ListItemIcon sx={{ color: "#aaa" }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Se D??connecter" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 5, mt: 15 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
