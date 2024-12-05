import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@mui/material";
import { apiUrl } from "../../lib/azureGlobals";
import { FileRecord } from "../../models/FileRecord";
import PrivatesFilesGallery from "./private/PrivateFilesGallery";
import PrivateFilesList from "./private/PrivateFilesList";

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);

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
      <Tabs
        value={activeTab}
        onChange={(_e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="List View" />
        <Tab label="Gallery View" />
      </Tabs>
      <Divider />
      {activeTab === 0 && (
        <PrivateFilesList
          files={files}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
      {activeTab === 1 && (
        <PrivatesFilesGallery
          files={files}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </Box>
  );
};

export default FileManager;
