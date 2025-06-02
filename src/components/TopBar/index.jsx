import React, { useEffect, useState, useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';


function TopBar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  const handleAddPhoto = () => {
    navigate("/photos/new");
  }


  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">PhotoSharing </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Typography vatiant="h6" component="span" sx={{ mr: 2 }}>
                Hi {user.first_name}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleAddPhoto}>Add Photo</Button>
              <Button variant="text" color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Typography variant="h6">Please Login</Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
