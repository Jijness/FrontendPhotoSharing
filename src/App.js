import React, { useContext } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import UploadPhoto from "./components/UploadPhoto";

import { AuthContext, AuthProvider } from "./contexts/AuthContext";

const AppContent = () => {
  // Lay trang thai dang nhap va thong tin user
  const { isLoggedIn, user, authReady } = useContext(AuthContext);
  // Component protected route yeu cau login
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn || !authReady) {
      return <Navigate to="/login" replace />;
    }
    return children; // login roi thi hien thi component con
  };

  return (
    <div className="app-container">
      <TopBar />
      <div className="main-topbar-buffer" />
      <Grid container spacing={0}>
        {isLoggedIn && (
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
        )}
        <Grid item sm={isLoggedIn ? 9 : 12}>
          <Paper className="main-grid-item">
            <Routes>
              <Route path="/login" element={<LoginRegister />} />
              <Route
                path="/photos/new"
                element={
                  <ProtectedRoute>
                    <UploadPhoto />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to={`/users/${user._id}`} replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/users" element={<UserList />} />
              <Route
                path="/users/:userId"
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/photos/:userId" element={<UserPhotos />} />

              <Route
                path="*"
                element={
                  isLoggedIn ? (
                    <Typography variant="h5">404: Page Not Found</Typography>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* boc toan bo AppContent trong AuthProvider */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
