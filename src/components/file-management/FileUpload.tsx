import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  blobServiceClient,
  containerId,
  cosmosClient,
  databaseId,
} from "../../lib/azureGlobals";

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
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

      // Ensure the container exists
      await containerClient.createIfNotExists();

      // Upload the file
      const blobClient = containerClient.getBlockBlobClient(uploadedFileName);
      const fileArrayBuffer = await file.arrayBuffer();
      await blobClient.uploadData(fileArrayBuffer, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      const blobUrl = blobClient.url;

      // Create a record in Cosmos DB
      const { database } = await cosmosClient.databases.createIfNotExists({
        id: databaseId,
      });
      const { container } = await database.containers.createIfNotExists({
        id: containerId,
      });

      const record = {
        id: uploadedFileName,
        fileName: file.name,
        url: blobUrl,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        type: file.type,
        author: "current-user",
      };

      await container.items.create(record);

      setMessage(`File uploaded and record created successfully.`);
      setSnackbarSeverity("success");

      // Notify parent of upload completion
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
