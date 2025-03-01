import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material"
import { axiosInstance } from "../../utils/axiosInstance";
const Register = () => {
  let  currentUserRole =localStorage.getItem("role")
  const initialFormState = {
    username: "",
    password: "",
    email: "",
    mobile: "",
    name: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // success or error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if current user is admin
    if (currentUserRole !== "admin") {
      setToastMessage("Only admin can create new users.");
      setToastSeverity("error");
      setOpenToast(true);
      return;
    }

    const token = localStorage.getItem("accessToken"); // Fetch the token from localStorage

    try {
      // API call using axiosInstance
      const response = await axiosInstance.post(`/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the headers
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === 201) {
        setToastMessage("User registered successfully!");
        setToastSeverity("success");
        // Clear form
        setFormData(initialFormState);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Something went wrong");
      setToastSeverity("error");
    } finally {
      setOpenToast(true);
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <Box sx={{marginTop:"1.5rem"}}>
      <Box
        sx={{
          marginTop: "5rem",
          padding: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
          // backgroundColor: "#f9f9f9",
          // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                // label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="admin">Admin</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={openToast}
          autoHideDuration={6000}
          onClose={handleCloseToast}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toastSeverity}
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Register;
