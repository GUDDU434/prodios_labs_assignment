import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../auth/AuthContext";
import { RegisterUser } from "../../Redux/auth/auth.action";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await login(username, password);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Email/Password incorrect");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm({ ...registrationForm, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (registrationForm.password !== registrationForm.confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    const data = {
      name: registrationForm.name,
      email: registrationForm.email,
      password: registrationForm.password,
    };
    dispatch(RegisterUser(data))
      .then((res) => {
        if (res === "SUCCESS") {
          toast.success("Registration successful");
          setOpen(false);
        }
      })
      .catch((error) => toast.error(error || "Registration failed"));
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            {"Login"}
          </Button>
          {/* <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/forgot-password")}
            sx={{ mt: 1 }}
          >
            Forgot Password?
          </Button> */}
        </form>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpen(true)}
          sx={{ mt: 2 }}
        >
          {"New User"}
        </Button>
        <ToastContainer />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "8%",
            right: "50%",
            transform: "translateX(50%)",
            width: { xs: "90%", sm: "75%", md: "50%", lg: "30%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography textAlign={"center"} variant="h4" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={registrationForm.name}
              name="name"
              onChange={handleFormChange}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={registrationForm.email}
              name="email"
              onChange={handleFormChange}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={registrationForm.password}
              name="password"
              onChange={handleFormChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={"text"}
              fullWidth
              margin="normal"
              value={registrationForm.confirmPassword}
              name="confirmPassword"
              onChange={handleFormChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              {"Register"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Login;
