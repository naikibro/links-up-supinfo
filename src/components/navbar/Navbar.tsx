import { AppBar, Box, Button, CircularProgress, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";

interface NavbarProps {
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const baseUrl =
    import.meta.env.VITE_ENV === "local"
      ? "http://localhost:4280"
      : "https://agreeable-island-0ffbb0c1e.4.azurestaticapps.net";

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Fetch Authentication State
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const response = await fetch("/.auth/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setAuthenticated(
            data?.clientPrincipal?.userRoles?.includes("authenticated") ?? false
          );
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching auth state:", error);
        setAuthenticated(false);
      }
    };
    fetchAuthState();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    window.location.href = `/.auth/logout`;
  };

  // Login Buttons Component
  const LoginButtons = () => (
    <Box>
      <Button
        href={`/.auth/login/github?post_login_redirect_uri=${baseUrl}`}
        variant="contained"
        color="primary"
        sx={{ mr: 2 }}
      >
        Login with GitHub
      </Button>
      <Button
        href={`/.auth/login/aad?post_login_redirect_uri=${baseUrl}`}
        variant="contained"
        color="secondary"
      >
        Login with Microsoft
      </Button>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000",
        mb: 4,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: authenticated ? "space-between" : "flex-end",
        }}
      >
        <Box sx={{ display: authenticated ? "flex" : "none", gap: 2 }}>
          <Button
            href="/feed"
            color="inherit"
            variant="outlined"
            sx={{
              textAlign: "left",
              ":hover": {
                border: "2px solid #ff4081",
              },
            }}
          >
            Links Up!
          </Button>
          <Button
            onClick={() => setCurrentPage("home")}
            color="inherit"
            variant="text"
            sx={{
              textAlign: "left",
              ":hover": {
                borderBottom: "2px solid #ff4081",
              },
            }}
          >
            My files
          </Button>
          <Button
            onClick={() => setCurrentPage("feed")}
            color="inherit"
            variant="text"
            sx={{
              textAlign: "left",
              ":hover": {
                borderBottom: "2px solid #ff4081",
              },
            }}
          >
            Public files
          </Button>
        </Box>

        {authenticated === null ? (
          <CircularProgress size={24} />
        ) : authenticated ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <LoginButtons />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
