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
import {
  blobServiceClient,
  containerId,
  cosmosClient,
  databaseId,
} from "../../lib/azureGlobals";

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
          } else {
            console.error("ClientPrincipal missing in auth data.");
            setUserInfo(null);
          }
        } else {
          console.error("Failed to fetch user info");
          setUserInfo(null);
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
      const containerName = "files";
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const uploadedFileName = `${timestamp}_${file.name}`;

      await containerClient.createIfNotExists();

      const blobClient = containerClient.getBlockBlobClient(uploadedFileName);
      const fileArrayBuffer = await file.arrayBuffer();
      await blobClient.uploadData(fileArrayBuffer, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      const blobUrl = blobClient.url;

      const { database } = await cosmosClient.databases.createIfNotExists({
        id: databaseId,
      });
      const { container } = await database.containers.createIfNotExists({
        id: containerId,
      });

      const record: FileRecord = {
        id: uploadedFileName,
        fileName: file.name,
        url: blobUrl,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        type: file.type,
        author: userInfo.userDetails,
        authorId: userInfo.userId,
      };

      await container.items.create(record);

      setMessage(`File uploaded and record created successfully.`);
      setSnackbarSeverity("success");

      if (onUploadComplete) onUploadComplete();
    } catch (error) {
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
