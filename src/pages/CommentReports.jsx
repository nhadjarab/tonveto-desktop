import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Loading, Empty } from "../components";
import {
  Typography,
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Rating,
  Button,
  Stack,
  LinearProgress,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formateDate } from "../utils/functions";

const CommentReports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHandleAction, setLoadingHandleAction] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleApproveCommentReport = async (row) => {
    const commentReportId = row.id;
    const comment_id = row.comment_id;
    const comment_type = row.report_type;
    setLoadingHandleAction(true);
    try {
      const res = await fetch(
        `${apiUrl}/approveCommentReport/${commentReportId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
            comment_id,
            comment_type,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== commentReportId)
        );
      } else {
        setError(data);
      }
    } catch (err) {
      console.error(err);
      if (err.name === "AbortError") return;
      setError("Something went wrong, please try again");
    }
    setLoadingHandleAction(false);
  };
  const handleRejectCommentReport = async (row) => {
    const commentReportId = row.id;
    const comment_id = row.comment_id;
    const comment_type = row.report_type;
    setLoadingHandleAction(true);
    try {
      const res = await fetch(
        `${apiUrl}/rejectCommentReport/${commentReportId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
            comment_id,
            comment_type,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== commentReportId)
        );
      } else {
        setError(data);
      }
    } catch (err) {
      console.error(err);
      if (err.name === "AbortError") return;
      setError("Something went wrong, please try again");
    }
    setLoadingHandleAction(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchCommentReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getAllCommentReports`, {
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
          const reports = await Promise.all(
            data.map(async (row) => {
              const vetRes = await fetch(`${apiUrl}/vet/${row.vet_id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                  logged_in_id: user.userId,
                },
                signal,
              });

              const vet = await vetRes.json();
              const ownerRes = await fetch(
                `${apiUrl}/user/${row.comment.owner_id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                    logged_in_id: user.userId,
                  },
                  signal,
                }
              );

              const owner = await ownerRes.json();
              return { ...row, vet, owner };
            })
          );
          console.log(reports);
          setRows(reports);
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

    fetchCommentReports();

    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {rows.length > 0 && (
        <Typography variant="h4" sx={{ mb: 4 }}>
          # Liste des rapports des commentaires
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loadingHandleAction && <LinearProgress />}
      <div>
        {rows.length === 0 && (
          <Empty msg="Aucun rapport de commentaire ?? afficher" mt={10} />
        )}
        {rows.map((row) => (
          <Accordion
            key={row.id}
            expanded={expanded === row.id}
            onChange={handleChange(row.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${row.id}-content`}
              id={`${row.id}-header`}
            >
              <Box sx={{ width: "100%" }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      {row.owner.first_name || row.owner.last_name
                        ? row.owner.first_name + " " + row.owner.last_name
                        : row.owner.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formateDate(new Date(row.comment.date))}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} align="right">
                    <Rating
                      name="read-only"
                      value={row.comment?.rating?.rating || 0}
                      readOnly
                      size="small"
                      precision={0.1}
                    />
                  </Grid>
                </Grid>
                <Typography
                  varinat="body2"
                  color="text.secondary"
                  align="justify"
                  sx={{ width: "85%", mt: 1 }}
                >
                  {row.comment.text}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 1, backgroundColor: "#f2f2f2", mb: 4 }}>
                <Typography variant="body1">
                  {row.vet.vetProfile.first_name || row.vet.vetProfile.last_name
                    ? row.vet.vetProfile.first_name +
                      " " +
                      row.vet.vetProfile.last_name
                    : row.vet.vetProfile.email}
                </Typography>
                <Typography sx={{ color: "text.secondary", mt: 1 }}>
                  {row.description}
                </Typography>
              </Box>
              <Stack direction="row-reverse">
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mr: "5px" }}
                  onClick={(event) => {
                    handleRejectCommentReport(row);
                  }}
                >
                  Refuser
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: "5px" }}
                  onClick={(event) => {
                    handleApproveCommentReport(row);
                  }}
                >
                  Approuver
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default CommentReports;
