import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, Grid, Typography } from "@mui/material";
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
    <Grid container spacing={2}>
      {files.map((file) => {
        const fileType = file.type.split("/")[0];

        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={file.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
                  borderRadius: "8px",
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
                  borderRadius: "8px",
                }}
              />
            ) : (
              <Typography variant="body2">{file.fileName}</Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
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
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PrivateFilesGallery;
