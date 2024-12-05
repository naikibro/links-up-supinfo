import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { FileRecord } from "../../../models/FileRecord";

export const FileItem: React.FC<{
  file: FileRecord;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}> = ({ file, onDelete, onTogglePublish }) => {
  const fileType = file.type.split("/")[0];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        mb: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: 2,
        }}
      >
        {fileType === "image" && (
          <img
            src={file.url}
            alt={file.fileName}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 10,
              transition: "transform 0.3s",
            }}
          />
        )}
        {fileType === "video" && (
          <video
            src={file.url}
            controls
            style={{
              maxWidth: "100%",
              borderRadius: 10,
              transition: "transform 0.3s",
            }}
          />
        )}
        {fileType === "audio" && (
          <audio src={file.url} controls style={{ width: "100%" }} />
        )}
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {file.fileName}
          </Typography>
          <Button
            variant="text"
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            download={file.fileName}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color={file.isPublished ? "success" : "warning"}
            onClick={() => onTogglePublish(file.id, !file.isPublished)}
          >
            {file.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(file.id)}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
