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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CommentReports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHandleAction, setLoadingHandleAction] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
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
        setLoading(false);
        if (res.status === 200) {
          setRows(data);
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };

    fetchCommentReports();

    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {rows.length > 0 && (
        <Typography variant="h4" sx={{ mb: 4 }}>
          # Liste Des Rapports Des Commentaires
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loadingHandleAction && <LinearProgress />}
      <div>
        {rows.length === 0 && (
          <Empty msg="Aucun rapport de commentaire à afficher" mt={10}/>
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
              <Typography variant="h6" sx={{ width: "33%", flexShrink: 0 }}>
                {row.report_type}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {row.description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  {row.comment.first_name || row.comment.last_name
                    ? row.comment.first_name.toUpperCase() +
                      " " +
                      row.comment.last_name.toUpperCase()
                    : row.comment.email}
                </Typography>
                <Rating
                  name="read-only"
                  value={row.comment?.rating?.rating || 0}
                  readOnly
                  precision={0.1}
                />
                <Typography varinat="body2" color="text.secondary">
                  {row.comment.text}
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
