import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading, Table, TonventoTabs, UserInfo } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";

const petColumns = [
  { field: "name", headerName: "Nom", flex: 1 },
  { field: "species", headerName: "Espèce", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "crossbreed", headerName: "Croisé", flex: 1 },
  { field: "sterilised", headerName: "Sterilisé", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
];
const appointmentsColumns = [
  { field: "date", headerName: "Date", flex: 1 },
  { field: "pet_name", headerName: "Pet Name", flex: 1 },
  { field: "vet_name", headerName: "Vet", flex: 1 },
  { field: "clinic", headerName: "Clinique", flex: 2 },
  { field: "full_address", headerName: "Adresse Compléte", flex: 2 },
];

const User = () => {
  const { userId } = useParams();
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const [row, setRow] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/${userId}`, {
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
          const appointments = data.appointments.map((appointement) => ({
            id: appointement.id,
            pet_name: appointement.pet.name,
            breed: appointement.pet.breed,
            sex: appointement.pet.sex,
            vet_name:
              appointement.vet.first_name + " " + appointement.vet.last_name,
            vet_email: appointement.vet.email,
            date: appointement.date + " à " + appointement.time,
            clinic: appointement.clinic.name,
            full_address:
              appointement.clinic.country +
              " " +
              appointement.clinic.city +
              " " +
              appointement.clinic.address +
              " ",
          }));
          setRow({ ...data, appointments });
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };
    fetchUser();
    return () => controller.abort();
  }, [userId]);

  if (!row) return <Loading />;

  return (
    <div>
      <UserInfo row={row} />
      <TonventoTabs
        tabsTiles={["Pets", "Rendez-Vous"]}
        tabsContents={[
          <Table columns={petColumns} rows={row.pets} margin="15px" />,
          <Table
            columns={appointmentsColumns}
            rows={row.appointments}
            margin="15px"
          />,
        ]}
      />
    </div>
  );
};

export default User;
