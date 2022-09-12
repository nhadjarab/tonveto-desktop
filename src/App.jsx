import { useState } from "react";
import {
  Container,
  CssBaseline,
  Stack,
  TextField,
  Button,
} from "@mui/material";

const App = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const res = await window.api.auth.signIn(user);
   console.log(res);
  };
  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          <TextField
            id="username"
            label="Nom d'utilisateur"
            variant="outlined"
            name="username"
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            label="Mot de passe"
            variant="outlined"
            name="password"
            onChange={handleInputChange}
          />
          <Button type="submit" size="large" variant="contained">
            Se Connecter
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default App;
