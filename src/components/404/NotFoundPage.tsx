import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "/images/identity/logos/1.png";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{ width: 200, height: 200, mb: 4 }}
      />

      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" gutterBottom>
        Woooops ! The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
