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
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const steps = ["Créer un compte", "Compléter ses information"];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });
  const [updateUser, setUpdateUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "2000-08-06",
    phone_number: "",
  });

  const [newUserError, setNewUserError] = useState("");
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateUserError, setUpdateUserError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { apiUrl } = useEnv();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setNewUser((prev) => ({ ...prev, [name]: value }));
      setUpdateUser((prev) => ({ ...prev, [name]: value }));
    } else if (name === "password")
      setNewUser((prev) => ({ ...prev, [name]: value }));
    else setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoadingNext(true);
      const res = await fetch(`${apiUrl}/registerAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      setLoadingNext(false);
      if (res.status === 200) {
        setActiveStep(1);
      } else {
        setNewUserError(data);
      }
    } catch (err) {
      console.error(err);
      setNewUserError("Something went wrong, please try again");
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const loginResponse = await fetch(`${apiUrl}/loginAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const loginData = await loginResponse.json();
      if (loginResponse.status !== 200) {
        setUpdateUserError("Something went wrong, please try again");
        return;
      }
      const token = loginData.jwtToken;
      const userId = loginData.adminProfile.id;
      const email = loginData.adminProfile.email;
      const username =
        loginData.adminProfile.first_name || loginData.adminProfile.last_name
          ? loginData.adminProfile.first_name?.toUpperCase() +
            " " +
            loginData.adminProfile.last_name?.toUpperCase()
          : "ADMIN";

      console.log(loginData);
      console.log(updateUser);
      const res = await fetch(`${apiUrl}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateUser),
      });
      const data = await res.json();
      setLoadingUpdate(false);
      if (res.status === 200) {
        loginUser({ token, userId,email, username }, () =>
          navigate("/home", { replace: true })
        );
      } else {
        setUpdateUserError(data);
      }
    } catch (err) {
      console.error(err);
      setUpdateUserError("Something went wrong, please try again");
    }
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
            <Typography variant="h2" align="center">
              Register to tonveto
            </Typography>
            <Stepper
              activeStep={activeStep}
              sx={{ marginBottom: 4, marginTop: 4 }}
            >
              {steps.map((label) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {activeStep === 0 && (
              <Stack
                spacing={2}
                component="form"
                onSubmit={handleRegister}
                sx={{ width: "100%" }}
              >
                {newUserError && <Alert severity="error">{newUserError}</Alert>}
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  required
                  onChange={handleInputChange}
                />
                <TextField
                  id="password"
                  label="Mot de passe"
                  variant="outlined"
                  name="password"
                  type="password"
                  required
                  onChange={handleInputChange}
                />
                <Link to="/">
                  Vous avez déja un compte? se connecter maintenant.
                </Link>
                <LoadingButton
                  loading={loadingNext}
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Suivant
                </LoadingButton>
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack
                spacing={2}
                component="form"
                onSubmit={handleUpdateInfo}
                sx={{ width: "100%" }}
              >
                {updateUserError && (
                  <Alert severity="error">{updateUserError}</Alert>
                )}
                <TextField
                  id="firstName"
                  label="Prénom"
                  variant="outlined"
                  name="first_name"
                  inputProps={{ pattern: "[a-zA-Z]*" }}
                  type="text"
                  required
                  onChange={handleInputChange}
                />
                <TextField
                  id="lastName"
                  label="Nom"
                  variant="outlined"
                  name="last_name"
                  inputProps={{ pattern: "[a-zA-Z]*" }}
                  type="text"
                  required
                  onChange={handleInputChange}
                />
                <TextField
                  id="phoneNumber"
                  label="Numéro de téléphone"
                  variant="outlined"
                  name="phone_number"
                  type="tel"
                  required
                  onChange={handleInputChange}
                />
                <TextField
                  id="birthDate"
                  label="Date de naissance"
                  variant="outlined"
                  name="birth_date"
                  type="date"
                  inputProps={{ min: "1930-01-01", max: "2004-12-31" }}
                  required
                  defaultValue={updateUser.birth_date}
                  onChange={handleInputChange}
                />
                <LoadingButton
                  loading={loadingUpdate}
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Confirmer
                </LoadingButton>
              </Stack>
            )}
          </Grid>
          <Grid item xs={6}>
            <AsideImage />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Register;
