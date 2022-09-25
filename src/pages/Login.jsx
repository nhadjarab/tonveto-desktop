import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AsideImage } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import {
  Container,
  Stack,
  TextField,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [userError, setUserError] = useState("");
  const [loading, setLaoding] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { apiUrl } = useEnv();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLaoding(true);
    try {
      const loginResponse = await fetch(`${apiUrl}/loginAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const loginData = await loginResponse.json();
      if (loginResponse.status !== 200) {
        setUserError("Something went wrong, please try again");
        return;
      }
      const token = loginData.jwtToken;
      const userId = loginData.adminProfile.id;
      loginUser({ token, userId }, () => navigate("/home", { replace: true }));
    } catch (err) {
      console.error(err);
      setUserError("Something went wrong, please try again");
    }
    setLaoding(false);
  };
  return (
    <>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={6}>
            <Stack
              spacing={2}
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Typography variant="h2" align="center">
                Tonveto
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                mb={4}
              >
                Bienvenu à Tonveto, Se connecter maintenant
              </Typography>
              {userError && <Alert severity="error">{userError}</Alert>}
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                onChange={handleInputChange}
              />
              <TextField
                id="password"
                label="Mot de passe"
                variant="outlined"
                name="password"
                type="password"
                onChange={handleInputChange}
              />
              <Link to="/register">
                Vous n'avez pas de compte? en créer un maintenant.
              </Link>
              <LoadingButton
                loading={loading}
                type="submit"
                size="large"
                variant="contained"
              >
                Se Connecter
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <AsideImage />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
