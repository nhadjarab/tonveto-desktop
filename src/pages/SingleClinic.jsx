import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loading,
  Table,
  TonventoTabs,
  UserInfo,
  ClinicInfo,
} from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography } from "@mui/material";

const vetColumns = [
  { field: "first_name", headerName: "Prénom", flex: 1 },
  { field: "last_name", headerName: "Nom", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
  { field: "bank_details", headerName: "Bank Details", flex: 1 },
  { field: "balance", headerName: "Balance", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
  { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const SingleClinic = () => {
  const { clinicId } = useParams();
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
        const res = await fetch(`${apiUrl}/clinic/${clinicId}`, {
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
          const vets = data.clinic.vets.map((vet) => ({
            ...vet.vet,
          }));
          setRow({ ...data, clinic: { ...data.clinic, vets } });
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
  }, [clinicId]);

  if (!row) return <Loading />;

  return (
    <div>
      <TonventoTabs
        tabsTiles={["Clinique", "Propriétaire"]}
        tabsContents={[
          <ClinicInfo row={row} />,
          <UserInfo row={row.clinic.owner} />,
        ]}
      />
      <Typography variant="h4" align="center">
        Membre du staff
      </Typography>
      <Table
        rows={row.clinic.vets}
        columns={vetColumns}
        onRowClick={(params, event, details) => {
          console.log(params.id);
          navigate(`/vets/${params.id}`);
        }}
        margin="15px"
      />
    </div>
  );
};

export default SingleClinic;
