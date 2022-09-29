import { useState, useEffect, createContext, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

const DownloadContext = createContext();
export const useDownload = (_) => useContext(DownloadContext);

const DownloadProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info");

  useEffect(() => {
    window.server.onDownloadCompleted(setMessage, setType);
    window.server.onDownloadCanceled(setMessage, setType);
    window.server.onDownloadStarted(setMessage, setType);
    window.server.onDownloadProgressing(setMessage, setType);
  }, []);
  
  return (
    <DownloadContext.Provider value={{ message, type }}>
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={6000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity={type}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </DownloadContext.Provider>
  );
};

export default DownloadProvider;
