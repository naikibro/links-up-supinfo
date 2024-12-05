import React from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FileRecord } from "../../../models/FileRecord";

interface FilesListProps {
  files: FileRecord[];
  onPreview: (file: FileRecord) => void;
}

const FilesList: React.FC<FilesListProps> = ({ files, onPreview }) => {
  return (
    <List>
      {files.map((file) => (
        <ListItem
          key={file.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {file.fileName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Uploaded At: {new Date(file.uploadedAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Author: {file.author}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              href={file.url}
              target="_blank"
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<VisibilityIcon />}
              onClick={() => onPreview(file)}
            >
              Preview
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default FilesList;
