const express = require("express");
const cors = require("cors");
const taskRouter = require("./controllers/task.controller");

const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  RefreshToken,
  GetUser,
  UpdateUserDetails,
} = require("./controllers/user.controller");
const { authenticate } = require("./middleware/auth_middleware");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/start", (req, res) => {
  res.send("Server is running");
});

// Auth Routes
app.post("/auth/registration", RegisterUser);
app.post("/auth/login", LoginUser);
app.post("/auth/refresh", RefreshToken);
app.get("/auth/logout", authenticate, LogoutUser);
app.get("/auth/user", authenticate, GetUser);
app.put("/auth/user", authenticate, UpdateUserDetails);

// Tasks Routes
app.post("/add", authenticate, taskRouter.CreateTask);
app.get("/fetchAllTasks", authenticate, taskRouter.GetAllTasks);
app.get("/fetchTaskById/:id", authenticate, taskRouter.GetTaskById);
app.put("/updateTaskById/:id", authenticate, taskRouter.UpdateTask);
app.delete("/deleteTaskById/:id", authenticate, taskRouter.DeleteTask);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
