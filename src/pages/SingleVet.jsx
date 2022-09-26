import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loading,
  TonventoTabs,
  Table,
  KPICard,
  Review,
  UserInfo,
  Empty,
} from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Paper, Typography, Grid } from "@mui/material";

const clinicColumns = [
  { field: "name", headerName: "Nom", flex: 1 },
  { field: "country", headerName: "Pays", flex: 1 },
  { field: "address", headerName: "Adresse", flex: 1 },
  { field: "zip_code", headerName: "Code Postal", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
];
const appointmentsColumns = [
  { field: "date", headerName: "Date", flex: 1 },
  { field: "pet_name", headerName: "Pet Name", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "user_name", headerName: "User", flex: 1 },
  { field: "user_email", headerName: "User Email", flex: 1 },
];

const SingleVet = () => {
  const { vetId } = useParams();
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const [row, setRow] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchVet = async () => {
      try {
        const res = await fetch(`${apiUrl}/vet/${vetId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
          },
          signal,
        });

        const data = await res.json();
        if (res.status === 200) {
          console.log(data);
          const appointments = data.vetProfile.appointments.map(
            (appointement) => ({
              id: appointement.id,
              pet_name: appointement.pet.name,
              breed: appointement.pet.breed,
              sex: appointement.pet.sex,
              user_name:
                appointement.user.first_name +
                " " +
                appointement.user.last_name,
              user_email: appointement.user.email,
              date: appointement.date + " à " + appointement.time,
            })
          );
          const clinics = data.vetProfile.clinics.map((clinic) => ({
            ...clinic.clinic,
          }));
          setRow({
            ...data,
            vetProfile: { ...data.vetProfile, appointments, clinics },
          });
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };
    fetchVet();
    return () => controller.abort();
  }, [vetId]);

  if (!row) return <Loading />;

  return (
    <div>
      <UserInfo
        row={row.vetProfile}
        rating={row?.vetRating?._avg?.rating || 0}
      />
      <Typography variant="h4" align="center">
        Spécialités
      </Typography>
      {row.vetProfile.specialities.length === 0 && (
        <Empty msg="Aucune spécialité à afficher" />
      )}
      <Grid container spacing={3} sx={{ marginTop: 1, marginBottom: 6 }}>
        {row.vetProfile.specialities.map((speciality) => (
          <Grid xs={4} item key={speciality.id}>
            <KPICard title={speciality.name} value={`${speciality.price}€`} />
          </Grid>
        ))}
      </Grid>
      <TonventoTabs
        tabsTiles={["Rendez-Vous", "Cliniques", "Evaluations"]}
        tabsContents={[
          <Table
            columns={appointmentsColumns}
            rows={row.vetProfile.appointments}
            margin="15px"
          />,
          <Table
            rows={row.vetProfile.clinics}
            columns={clinicColumns}
            onRowClick={(params, event, details) => {
              console.log(params.id);
              navigate(`/clinics/${params.id}`);
            }}
            margin="15px"
          />,
          <Paper sx={{ maxHeight: "800px", overflowY: "auto" }}>
            {row.vetProfile.CommentVet.map((comment) => (
              <Review key={comment.id} comment={comment} />
            ))}
            {row.vetProfile.CommentVet.length === 0 && (
              <Empty msg="Aucune spécialité à afficher" />
            )}
          </Paper>,
        ]}
      />
    </div>
  );
};

export default SingleVet;
