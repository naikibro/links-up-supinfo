import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Container,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUpload from "../components/file-management/FileUpload";
import PublicFiles from "../components/file-management/lists/PublicFiles";
import { FilePreview } from "../components/file-management/preview/FilePreview";
import Navbar from "../components/navbar/Navbar";
import { apiUrl } from "../lib/azureGlobals";
import { FileRecord } from "../models/FileRecord";
import logo from "/images/identity/logos/1.png";

const PublicFeedPage: React.FC = () => {
  // constants
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [publishedFiles, setPublishedFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);

  // methods
  const handlePreviewFile = (file: FileRecord) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const toggleDrawer = (isOpen: boolean) => {
    setDrawerOpen(isOpen);
  };

  const handleUploadComplete = () => {
    toggleDrawer(false);
    fetchPublishedFiles();
  };

  const fetchPublishedFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/files`);
      if (response.ok) {
        const data: FileRecord[] = await response.json();
        const published = data.filter((file) => file.isPublished);
        setPublishedFiles(published);
      } else {
        console.error("Failed to fetch published files");
      }
    } catch (error) {
      console.error("Error fetching published files:", error);
    } finally {
      setLoading(false);
    }
  };

  // hooks
  useEffect(() => {
    const fetchUserInfoAndFiles = async () => {
      try {
        const authResponse = await fetch("/.auth/me", {
          credentials: "include",
        });
        if (authResponse.ok) {
          const authData = await authResponse.json();
          const isAuthenticated =
            authData?.clientPrincipal?.userRoles.includes("authenticated");
          setAuthenticated(isAuthenticated);
        } else {
          setAuthenticated(false);
        }

        await fetchPublishedFiles();
      } catch (error) {
        console.error("Error fetching authentication or files:", error);
        setAuthenticated(false);
      }
    };

    fetchUserInfoAndFiles();
  }, []);

  return (
    <Box>
      <Navbar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ width: 200, height: 200 }}
        />

        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ mt: 4, mb: 2, textAlign: "center" }}
        >
          PUBLICLY AVAILABLE FILES
        </Typography>

        {/* Divider */}
        <Divider sx={{ width: "100%", my: 4 }} />

        <Box maxWidth="sm">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={120}
                sx={{ mb: 2, borderRadius: "8px" }}
              />
            ))
          ) : (
            <PublicFiles files={publishedFiles} onPreview={handlePreviewFile} />
          )}
        </Box>

        {/* FAB for opening the drawer */}
        {authenticated && (
          <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => toggleDrawer(true)}
          >
            <AddIcon />
            <Typography>Add a media</Typography>
          </Fab>
        )}

        {/* Drawer for FileUpload */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
          sx={{
            ".MuiDrawer-paper": {
              width: "100vw",
              height: "100vh",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6">Upload a New File</Typography>
              <IconButton onClick={() => toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </Box>
        </Drawer>

        {/* Modal for Preview */}
        <Modal open={!!previewFile} onClose={handleClosePreview}>
          <FilePreview file={previewFile} onClose={handleClosePreview} />
        </Modal>
      </Container>
    </Box>
  );
};

export default PublicFeedPage;
