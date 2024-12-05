import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";
import { FileRecord } from "../../../models/FileRecord";

interface FileListProps {
  files: FileRecord[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

const PrivateFileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  onTogglePublish,
}) => {
  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {files.map((file) => {
        const fileType = file.type.split("/")[0];

        return (
          <React.Fragment key={file.id}>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
                padding: 2,
                overflow: "hidden",
              }}
            >
              {/* File preview */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: {
                    xs: "100%",
                    sm: "40%",
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
                      borderRadius: 1,
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
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <Typography variant="body1">
                    Unsupported file type: {file.fileName}
                  </Typography>
                )}
              </Box>

              {/* File metadata and actions */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="h6">{file.fileName}</Typography>
                <Typography variant="body2">
                  Uploaded At: {new Date(file.uploadedAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Published: {file.isPublished ? "Yes" : "No"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
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
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default PrivateFileList;
