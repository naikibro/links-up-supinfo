import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Container,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FileManager from "./components/file-management/FileManager";
import FileUpload from "./components/file-management/FileUpload";
import logo from "/images/identity/logos/1.png";

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (isOpen: boolean) => {
    setDrawerOpen(isOpen);
  };

  const handleUploadComplete = () => {
    toggleDrawer(false);

    window.location.reload();
  };

  return (
    <Container
      maxWidth="sm"
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
        The app to manage your social media files
      </Typography>

      {/* Divider */}
      <Divider sx={{ width: "100%", my: 4 }} />

      {/* FileManager */}
      <FileManager />

      {/* FAB for opening the drawer */}
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
            <IconButton onClick={() => toggleDrawer(false)} sx={{}}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </Box>
      </Drawer>
    </Container>
  );
};

export default App;
