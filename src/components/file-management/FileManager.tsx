import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { containerId, cosmosClient, databaseId } from "../../lib/azureGlobals";

interface FileRecord {
  id: string;
  fileName: string;
  uploadedAt: string;
  url: string;
  author: string;
  type: string;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  // Fetch authenticated user info
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

  // Fetch files for the current user
  useEffect(() => {
    if (!userId) return;

    const fetchFiles = async () => {
      try {
        const { database } = await cosmosClient.databases.createIfNotExists({
          id: databaseId,
        });
        const { container } = await database.containers.createIfNotExists({
          id: containerId,
        });
        const query = {
          query: "SELECT * FROM c WHERE c.authorId = @userId",
          parameters: [{ name: "@userId", value: userId }],
        };
        const { resources } = await container.items
          .query<FileRecord>(query)
          .fetchAll();
        setFiles(resources);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const renderFile = (file: FileRecord) => {
    const fileType = file.type.split("/")[0];

    switch (fileType) {
      case "image":
        return (
          <>
            <img
              src={file.url}
              alt={file.fileName}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
            {file.fileName} - Uploaded at{" "}
            {new Date(file.uploadedAt).toLocaleString()}
          </>
        );
      case "video":
        return (
          <video
            src={file.url}
            controls
            style={{ maxWidth: "100%", borderRadius: 10 }}
          />
        );
      case "audio":
        return <audio src={file.url} controls style={{ width: "100%" }} />;
      default:
        return (
          <Button
            variant="contained"
            color="primary"
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </Button>
        );
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
          <ListItem
            key={file.id}
            sx={{ display: "flex", flexDirection: "column", mb: 2 }}
          >
            <Typography variant="subtitle1" gutterBottom></Typography>
            {renderFile(file)}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileManager;
