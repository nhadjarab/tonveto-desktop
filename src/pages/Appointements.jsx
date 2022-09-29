import { useState, useEffect, useMemo } from "react";
import { Loading, KPICard, Table } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Grid } from "@mui/material";

const columns = [
  { field: "user_name", headerName: "Propriétaire", flex: 1 },
  { field: "user_email", headerName: "Email", flex: 1 },
  { field: "pet_name", headerName: "Animal", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "vet_name", headerName: "Vétérinaire", flex: 1 },
  { field: "vet_email", headerName: "Email du vétérinaire", flex: 1 },
];

const Appointements = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();

  const numberOfAppointments = useMemo(() => {
    return rows.length;
  }, [rows.length]);

  const numberOfAppointmentsThisMonth = useMemo(() => {
    return rows.reduce((nb, row) => {
      const thisMonth = new Date().getMonth() + 1;
      const thisYear = new Date().getFullYear();
      const appointmentMonth = row.date.substring(5, 7);
      const appointmentYear = row.date.substring(0, 4);

      return appointmentMonth == thisMonth && thisYear == appointmentYear
        ? nb + 1
        : nb;
    }, 0);
  }, [rows.length]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getAllAppointments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
          },
          signal,
        });

        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          const appointements = data.map((appointement) => ({
            id: appointement.id,
            user_name:
              appointement.user.first_name + " " + appointement.user.last_name,
            user_email: appointement.user.email,
            pet_name: appointement.pet.name,
            breed: appointement.pet.breed,
            date: appointement.date + " à " + appointement.time,
            vet_name:
              appointement.vet.first_name + " " + appointement.vet.last_name,
            vet_email: appointement.vet.email,
          }));
          setRows(appointements);
        } else {
          setError("Something went wrong, please try again");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Grid container spacing={3} sx={{ marginBottom: 8 }}>
        <Grid xs={6} item>
          <KPICard title="Nombre De Rendez-vous" value={numberOfAppointments} />
        </Grid>
        <Grid xs={6} item>
          <KPICard
            title="Nombre de Rendez-vous ce mois"
            value={numberOfAppointmentsThisMonth}
          />
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste des rendez-vous
      </Typography>
      <Table columns={columns} rows={rows} error={error} />
    </div>
  );
};

export default Appointements;
