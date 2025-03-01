import { Menu as MenuIcon } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthContext } from "../../auth/AuthContext";
import {
  getUserDetails,
  updateUserDetails,
} from "../../Redux/auth/auth.action";
import { AddTask } from "../../Redux/task/task.action";
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Navbar = ({ onOpen }) => {
  const { user } = useContext(AuthContext);
  const [userModal, setUserModal] = useState(false);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState();
  const [editable, setEditable] = useState(false);
  const { profile } = useSelector((state) => state.loginReducer);
  const [addModal, setAddModal] = useState(false);
  const [task, setTask] = useState({});

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    setUserDetails(profile);
  }, [profile, user]);

  const handleCloseUserModal = () => {
    setUserModal(false);
  };

  const handleCloseaddModal = () => {
    setAddModal(false);
  };

  const getAvatarLatter = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSaveUserDetails = () => {
    dispatch(updateUserDetails(profile?._id, userDetails)).then(() => {
      dispatch(getUserDetails());
    });
    setEditable(false);
    toast.success("User Details updated successfully!");
  };

  const createTask = (e) => {
    e.preventDefault();
    const formData = { ...task, status: "todo" };
    dispatch(AddTask(formData))
      .then(() => {
        setAddModal(false);
        setTask({});
        toast.success("Task created successfully");
      })
      .catch((error) => {
        toast.error(error || "Task creation failed");
      });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1100,
          background: "#191970",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open menu"
            onClick={onOpen}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Prodios Labs</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={() => setAddModal(true)}
            >
              <AddCircleOutlineIcon />
              {"Add"}
            </Box>

            {/* Avatar Section */}
            <Box
              sx={{ display: "flex", justifyContent: "center" }}
              onClick={() => setUserModal(true)}
            >
              <Avatar
                sx={{
                  bgcolor: getRandomColor(),
                }}
                src={userDetails?.profile_pic}
              >
                {getAvatarLatter(userDetails?.name || "")}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Modal open={userModal} onClose={handleCloseUserModal}>
        <Box
          sx={{
            position: "absolute",
            top: "8%",
            right: "2%",
            width: { xs: "90%", sm: "75%", md: "50%", lg: "30%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          {/* Avatar Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: getRandomColor(),
                width: 100,
                height: 100,
                fontSize: 40,
              }}
              src={userDetails?.profile_pic}
            >
              {getAvatarLatter(userDetails?.name || "")}
            </Avatar>
          </Box>

          {/* User Information */}
          <Box>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Name"
              value={userDetails?.name}
              onChange={(e) => {
                setUserDetails({ ...userDetails, name: e.target.value });
              }}
              InputProps={{
                readOnly: !editable,
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              label="Email"
              value={userDetails?.email}
              InputProps={{
                readOnly: !editable,
              }}
              disabled
            />
          </Box>

          {/* Edit Button */}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            {!editable ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditable(!editable)}
                sx={{ textTransform: "none" }}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={handleSaveUserDetails}
                sx={{ textTransform: "none" }}
              >
                Save
              </Button>
            )}
          </Box>

          {/* Logout Button */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Create New Task */}
      <Modal open={addModal} onClose={handleCloseaddModal}>
        <Box
          component="form"
          onSubmit={createTask}
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
          {/* User Information */}

          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Title"
            value={task?.title}
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
            }}
            required
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Description"
            value={task?.description}
            onChange={(e) => {
              setTask({ ...task, description: e.target.value });
            }}
            required
          />
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Due Date"
            value={task?.dueDate}
            onChange={(e) => {
              setTask({ ...task, dueDate: e.target.value });
            }}
            required
          />
          <Select
            variant="outlined"
            fullWidth
            margin="normal"
            label="Priority"
            name="priority"
            value={task?.priority || ""}
            onChange={(e) => {
              setTask({ ...task, priority: e.target.value });
            }}
            required
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Priority
            </MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>

          <Button sx={{ mt: 2 }} fullWidth variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
