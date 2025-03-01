import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { colorCodes } from "../utils/color_codes";
import { useDispatch } from "react-redux";
import { DeleteTask } from "../Redux/task/task.action";

const TaskCard = ({ task, setOpenModal, setSelectedTask }) => {
  const dispatch = useDispatch();

  // Edit task function
  const onEdit = (selectedTask) => {
    setOpenModal(true);
    setSelectedTask(selectedTask);
  };

  // Delete task function
  const onDelete = (id) => {
    dispatch(DeleteTask(id));
  };

  return (
    <Card
      sx={{
        margin: 2,
        boxShadow: 3,
        borderRadius: 2,
        border: `1px solid ${colorCodes[task.priority]}`,
        cursor: "pointer",
      }}
    >
      <CardHeader
        title={task.title}
        sx={{
          backgroundColor: colorCodes[task.priority],
          maxLines: 2,
          color: "white",
        }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" noWrap>
          {task.description}
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong>Priority:</strong>{" "}
          <span style={{ color: colorCodes[task.priority] }}>
            {task.priority.toUpperCase()}
          </span>
        </Typography>
        <Typography variant="body2">
          <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          fontSize={12}
          color="text.secondary"
          alignItems="center"
        >
          <Typography variant="body">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body">
            Updated: {new Date(task.updatedAt).toLocaleDateString()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
