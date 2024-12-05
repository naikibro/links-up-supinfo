import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../lib/azureGlobals";
import { FileRecord } from "../../models/FileRecord";
import { UserInfo } from "../../models/UserInfo";

interface FileUploadProps {
  onUploadComplete?: () => void;
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
  const [isPublished, setIsPublished] = useState<boolean>(false);

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
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setMessage(`Selected file: ${selectedFile.name}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
      const fileBuffer = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const payload = {
        fileName: file.name,
        fileType: file.type,
        fileBuffer,
        isPublished,
        userInfo: {
          userId: userInfo.userId,
          userDetails: userInfo.userDetails,
        },
      };

      const response = await fetch(`${apiUrl}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data: FileRecord = await response.json();
          setMessage(`File uploaded successfully: ${data.fileName}`);
          setSnackbarSeverity("success");
          if (onUploadComplete) onUploadComplete();
        } else {
          setMessage("Upload succeeded but unexpected response format.");
          setSnackbarSeverity("error");
        }
      } else {
        try {
          const errorData = await response.json();
          setMessage(`Upload failed: ${errorData.message}`);
        } catch {
          setMessage("Upload failed: Unable to parse error response.");
        }
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
      <Box sx={{ mb: 2, textAlign: "left" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              color="primary"
            />
          }
          label="Upload as visible to anyone"
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
