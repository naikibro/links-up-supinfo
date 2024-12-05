import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {files.map((file) => {
          const fileType = file.type.split("/")[0];

          return (
            <ListItem
              key={file.id}
              sx={{
                maxWidth: 350,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
                listStyle: "none",
                backgroundColor: "#f9f9f9",
                boxShadow: 2,
                p: 0,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 4,
                },
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
                    maxHeight: "150px",
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
                    maxHeight: "150px",
                  }}
                />
              ) : fileType === "audio" ? (
                <Box
                  component="audio"
                  src={file.url}
                  controls
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: "150px",
                  }}
                />
              ) : null}
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  mt: 1,
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                  },
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {file.fileName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 1,
                  px: 2,
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  href={file.url}
                  download
                  startIcon={<DownloadIcon />}
                  sx={{
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.85rem",
                    },
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handlePreviewFile(file)}
                  startIcon={<VisibilityIcon />}
                  sx={{
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.85rem",
                    },
                  }}
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
            width: "100%",
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
              flexDirection: "column",
              gap: 2,
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
                  borderRadius: 2,
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
                  borderRadius: 2,
                }}
              />
            ) : previewFile?.type.split("/")[0] === "audio" ? (
              <Box
                component="audio"
                src={previewFile.url}
                controls
                sx={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
            ) : null}

            <Button
              variant="text"
              color="primary"
              href={previewFile?.url}
              startIcon={<DownloadIcon />}
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.85rem",
                },
              }}
            >
              Download
            </Button>

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
                <strong>File Name:</strong> {previewFile?.fileName}
              </Typography>
              <Typography variant="body1">
                <strong>Uploaded At:</strong> {previewFile?.uploadedAt}
              </Typography>
              <Typography variant="body1">
                <strong>Author:</strong> {previewFile?.author}
              </Typography>
              {previewFile?.isPublished !== undefined && (
                <Typography variant="body1">
                  <strong>Published:</strong>{" "}
                  {previewFile.isPublished ? "Yes" : "No"}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FilesGallery;
