import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Box, Paper, Alert, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const LoginRegister = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ham login tu AuthContext

  const [tabIndex, setTabIndex] = useState(0); // 0: Login, 1: Register
  const [loginError, setloginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const {
    register: loginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm();

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
    getValues,
  } = useForm();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setloginError("");
    setRegisterError("");
    setRegisterSuccess("");
    resetLoginForm();
    resetRegisterForm();
  };

  const onLoginSubmit = async (data) => {
    setloginError("");
    try {
      const response = await fetch("https://82rysc-8081.csb.app/api/user/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: data.login_name,
          password: data.password,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setloginError(responseData.message || "Login failed");
      } else {
        // goi ham login tu AuthContext
        login(responseData, responseData.token);
        navigate(`/users/${responseData._id}`); // den trang cua user vua login
      }
    } catch (err) {
      console.error("Login error:", err);
      setloginError("Network error or server is unreachable.");
    }
  };
  const onRegisterSubmit = async (data) => {
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const response = await fetch("https://82rysc-8081.csb.app/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: data.login_name,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          location: data.location || "",
          description: data.description || "",
          occupation: data.occupation || "",
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setRegisterError(responseData.message || "Registration failed");
      } else {
        setRegisterSuccess(`User ${responseData.login_name} registered successfully! You can now log in.`);
        resetRegisterForm();
        setTabIndex(0);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterError("Network error or server is unreachable.");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Photo Sharing App
        </Typography>

        <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tabIndex === 0 && ( // UI cho login
          <Box component="form" noValidate onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <Typography varient="h6" gutterBottom>
              Login
            </Typography>
            <TextField
              label="Login Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...loginForm("login_name", {
                required: "Login name is required",
              })}
              error={!!loginErrors.login_name}
              helperText={loginErrors.login_name?.message}
            />
            <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" {...loginForm("password", { required: "Password is required" })} error={!!loginErrors.password} helperText={loginErrors.password?.message} />
            {loginError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {loginError}
              </Alert>
            )}
            <Button type="submit" varient="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Login
            </Button>
          </Box>
        )}

        {tabIndex === 1 && ( // UI cho register
          <Box component="form" noValidate onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <Typography varient="h6" gutterBottom>
              Register new user
            </Typography>
            <TextField
              label="Login Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerForm("login_name", {
                required: "Login name is required",
              })}
              error={!!registerErrors.login_name}
              helperText={registerErrors.login_name?.message}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerForm("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              error={!!registerErrors.password}
              helperText={registerErrors.password?.message}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerForm("confirm_password", {
                required: "Password is required",
                validate: (value) => value === getValues("password") || "Passwords do not match",
              })}
              error={!!registerErrors.confirm_password}
              helperText={registerErrors.confirm_password?.message}
            />
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerForm("first_name", {
                required: "First name is required",
              })}
              error={!!registerErrors.first_name}
              helperText={registerErrors.first_name?.message}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerForm("last_name", {
                required: "Last name is required",
              })}
              error={!!registerErrors.last_name}
              helperText={registerErrors.last_name?.message}
            />
            <TextField label="Location" variant="outlined" fullWidth margin="normal" {...registerForm("location")} />
            <TextField label="Description" variant="outlined" fullWidth margin="normal" {...registerForm("description")} />
            <TextField label="Occupation" variant="outlined" fullWidth margin="normal" {...registerForm("occupation")} />

            {registerError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {registerError}
              </Alert>
            )}
            {registerSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {registerSuccess}
              </Alert>
            )}
            <Button type="submit" varient="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Register
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
export default LoginRegister;
