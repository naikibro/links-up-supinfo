import { Typography, Modal, Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { FileRecord } from "../../../models/FileRecord";
import React from "react";

export const FilePreview: React.FC<{
  file: FileRecord | null;
  onClose: () => void;
}> = ({ file, onClose }) => {
  if (!file) {
    return null; // Return nothing if no file is passed
  }

  const fileType = file.type.split("/")[0];

  return (
    <Modal open={!!file} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          maxWidth: "90vw",
          maxHeight: "90vh",
          width: "100%",
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            {file.fileName ? `Preview: ${file.fileName}` : "File Preview"}
          </Typography>
          <Button variant="text" onClick={onClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </Box>

        {/* File Preview Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {fileType === "image" && (
            <Box
              component="img"
              src={file.url}
              alt={file.fileName}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
          {fileType === "video" && (
            <Box
              component="video"
              src={file.url}
              controls
              autoPlay
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
          {fileType === "audio" && (
            <Box
              component="audio"
              src={file.url}
              controls
              sx={{
                width: "100%",
                maxHeight: "80vh",
                borderRadius: 2,
              }}
            />
          )}
          {fileType !== "image" &&
            fileType !== "video" &&
            fileType !== "audio" && (
              <Typography>
                File preview not supported.{" "}
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  Download file
                </a>{" "}
                instead.
              </Typography>
            )}

          {/* Metadata Section */}
          <Box
            sx={{
              width: "100%",
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: 2,
              backgroundColor: "#f0f0f0",
              borderRadius: 2,
            }}
          >
            <Typography variant="body1">
              <strong>File Name:</strong> {file.fileName}
            </Typography>
            <Typography variant="body1">
              <strong>Uploaded At:</strong> {file.uploadedAt}
            </Typography>
            <Typography variant="body1">
              <strong>Author:</strong> {file.author}
            </Typography>
            {file.isPublished !== undefined && (
              <Typography variant="body1">
                <strong>Published:</strong> {file.isPublished ? "Yes" : "No"}
              </Typography>
            )}
          </Box>

          {/* Download Button */}
          <Button
            variant="contained"
            color="primary"
            href={file.url}
            download
            startIcon={<DownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
