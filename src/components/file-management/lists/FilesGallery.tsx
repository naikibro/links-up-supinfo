import React, { useState } from "react";
import {
  List,
  ListItem,
  Button,
  Box,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { FileRecord } from "../../../models/FileRecord";

interface FilesGalleryProps {
  files: FileRecord[];
}

const FilesGallery: React.FC<FilesGalleryProps> = ({ files }) => {
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);

  const handlePreviewFile = (file: FileRecord) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  return (
    <>
      <List
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          padding: 0,
        }}
      >
        {files.map((file) => {
          const fileType = file.type.split("/")[0];

          return (
            <ListItem
              key={file.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
                listStyle: "none",
                backgroundColor: "#f9f9f9",
              }}
            >
              {fileType === "image" ? (
                <Box
                  component="img"
                  src={file.url}
                  alt={file.fileName}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              ) : fileType === "video" ? (
                <Box
                  component="video"
                  src={file.url}
                  autoPlay
                  loop
                  muted
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: ["video", "image"].includes(file.type.split("/")[0])
                    ? "none"
                    : "block",
                }}
              >
                {file.fileName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  href={file.url}
                  download
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handlePreviewFile(file)}
                  startIcon={<VisibilityIcon />}
                >
                  Preview
                </Button>
              </Box>
            </ListItem>
          );
        })}
      </List>

      {/* Modal for Preview */}
      <Modal open={!!previewFile} onClose={handleClosePreview}>
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
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              {previewFile?.fileName || "Preview"}
            </Typography>
            <IconButton onClick={handleClosePreview}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {previewFile?.type.split("/")[0] === "image" ? (
              <Box
                component="img"
                src={previewFile.url}
                alt={previewFile.fileName}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : previewFile?.type.split("/")[0] === "video" ? (
              <Box
                component="video"
                src={previewFile.url}
                controls
                autoPlay
                sx={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : null}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FilesGallery;
