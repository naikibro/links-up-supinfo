import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../lib/azureGlobals";
import { FileRecord } from "../../models/FileRecord";
import { FileItem } from "./preview/FileItem";

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/.auth/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          const clientPrincipal = data?.clientPrincipal;
          if (clientPrincipal?.userId) {
            setUserId(clientPrincipal.userId);
          }
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchFiles = async () => {
      try {
        const response = await fetch(`${apiUrl}/files/${userId}`);
        if (response.ok) {
          const data: FileRecord[] = await response.json();
          setFiles(data);
        } else {
          console.error("Failed to fetch files from API");
        }
      } catch (error) {
        console.error("Error fetching files from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/files/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFiles((prev) => prev.filter((file) => file.id !== id));
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`${apiUrl}/files/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (response.ok) {
        setFiles((prev) =>
          prev.map((file) => (file.id === id ? { ...file, isPublished } : file))
        );
      } else {
        console.error("Failed to toggle publish state");
      }
    } catch (error) {
      console.error("Error toggling publish state:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All My Files
      </Typography>
      <List>
        {files.map((file) => (
          <React.Fragment key={file.id}>
            <ListItem
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
            >
              <FileItem
                file={file}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default FileManager;
