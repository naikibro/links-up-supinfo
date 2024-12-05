import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { FileRecord } from "../../../models/FileRecord";

interface PrivateFilesGalleryProps {
  files: FileRecord[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

const PrivateFilesGallery: React.FC<PrivateFilesGalleryProps> = ({
  files,
  onDelete,
  onTogglePublish,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {files.map((file) => {
        const fileType = file.type.split("/")[0];

        return (
          <Box
            key={file.id}
            sx={{
              width: {
                xs: "100%",
                sm: "calc(50% - 16px)",
                md: "calc(33.333% - 16px)",
              },
              display: "flex",
              flexDirection: "column",
              gap: 1,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: 2,
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
                  borderRadius: "8px 8px 0 0",
                }}
              />
            ) : fileType === "video" ? (
              <Box
                component="video"
                src={file.url}
                controls
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
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
                  borderRadius: "8px 8px 0 0",
                }}
              />
            ) : (
              <Typography variant="body2" sx={{ p: 2 }}>
                {file.fileName}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                href={file.url}
                download
                startIcon={<DownloadIcon />}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Download
              </Button>
              <Button
                variant="contained"
                color={file.isPublished ? "success" : "warning"}
                onClick={() => onTogglePublish(file.id, !file.isPublished)}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {file.isPublished ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(file.id)}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PrivateFilesGallery;
