import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../lib/azureGlobals";
import DownloadIcon from "@mui/icons-material/Download";

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

  const renderFile = (file: FileRecord) => {
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
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const button = target.querySelector("button") as HTMLButtonElement | null;
    const imageOrVideo = target.querySelector("img, video") as
      | HTMLImageElement
      | HTMLVideoElement
      | null;

    if (button) button.style.display = "block";
    if (imageOrVideo) imageOrVideo.style.transform = "scale(1.05)";
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const button = target.querySelector("button") as HTMLButtonElement | null;
    const imageOrVideo = target.querySelector("img, video") as
      | HTMLImageElement
      | HTMLVideoElement
      | null;

    if (button) button.style.display = "none";
    if (imageOrVideo) imageOrVideo.style.transform = "scale(1)";
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All My Files
      </Typography>
      <List>
        {files.map((file) => (
          <>
            <ListItem
              component="div"
              key={file.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {renderFile(file)}
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Box>
  );
};

export default FileManager;
