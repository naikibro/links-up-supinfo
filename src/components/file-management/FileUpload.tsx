import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../lib/azureGlobals";

interface FileUploadProps {
  onUploadComplete?: () => void;
}

interface UserInfo {
  userId: string;
  userDetails: string;
  identityProvider: string;
  userRoles: string[];
}

interface FileRecord {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  size: number;
  type: string;
  author: string;
  authorId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/.auth/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          const clientPrincipal = data?.clientPrincipal;
          if (clientPrincipal) {
            setUserInfo({
              userId: clientPrincipal.userId,
              userDetails: clientPrincipal.userDetails,
              identityProvider: clientPrincipal.identityProvider,
              userRoles: clientPrincipal.userRoles,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!userInfo) {
      setMessage("User information not available. Please log in.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "userInfo",
        JSON.stringify({
          userId: userInfo.userId,
          userDetails: userInfo.userDetails,
        })
      );

      const response = await fetch(`${apiUrl}/files`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: FileRecord = await response.json();
        setMessage(`File uploaded successfully: ${data.fileName}`);
        setSnackbarSeverity("success");
        if (onUploadComplete) onUploadComplete();
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.message}`);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(`Upload failed: ${error}`);
      setSnackbarSeverity("error");
    } finally {
      setIsUploading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, textAlign: "center", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        File Upload
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          type="file"
          inputProps={{ accept: "*" }}
          onChange={handleFileChange}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={isUploading}
        sx={{ mb: 2 }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>

      {isUploading && <LinearProgress sx={{ mb: 2 }} />}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "50%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
