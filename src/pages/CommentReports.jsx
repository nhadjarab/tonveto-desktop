import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
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
  LinearProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CommentReports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleApproveCommentReport = async (row) => {
    const commentReportId = row.id;
    const commentId = row.comment_id;
    const commentType = row.report_type
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/approveCommentReport/${commentReportId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          logged_in_id: user.userId,
          commentType,
          commentId
        },
      });

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== commentReportId));
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
  const handleRejectCommentReport = async (row) => {
    const commentReportId = row.id;
    const commentId = row.comment_id;
    const commentType = row.report_type
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/rejectCommentReport/${commentReportId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          logged_in_id: user.userId,
          commentType,
          commentId
        },
      });

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== commentReportId));
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchCommentReports = async () => {
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
    setLoading(true);
    fetchCommentReports();
    setLoading(false);
    return () => controller.abort();
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Comment Reports
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <LinearProgress />}
      <div>
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
