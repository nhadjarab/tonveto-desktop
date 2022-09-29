import { useState, useEffect } from "react";
import { Loading, UserInfo } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";

const Profile = () => {
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const userId = user.userId;
  const [admin, setAdmin] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/admin/${userId}`, {
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
          setAdmin(data);
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
      setLoading(false);
    };
    fetchUser();
    return () => controller.abort();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div>
      <UserInfo row={admin} />
    </div>
  );
};

export default Profile;
