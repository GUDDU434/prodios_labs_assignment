import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllTasks, UpdateTask } from "../../Redux/task/task.action";
import TaskCard from "../../Components/TaskCard";
import Loading from "../../Components/Loader/Loading";
import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";

const initialTasks = { todo: [], inProgress: [], done: [] };

const Home = () => {
  const dispatch = useDispatch();
  const { AllTasks, isTasksLoading } = useSelector((state) => state.Task);

  // Local state for managing tasks and modal
  const [tasks, setTasks] = useState(initialTasks);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});

  // Fetch all tasks on component mount
  useEffect(() => {
    dispatch(GetAllTasks());
  }, [dispatch]);

  // Update task state when AllTasks change
  useEffect(() => {
    if (AllTasks.length > 0) {
      setTasks({
        todo: AllTasks.filter((task) => task.status === "todo"),
        inProgress: AllTasks.filter((task) => task.status === "inProgress"),
        done: AllTasks.filter((task) => task.status === "done"),
      });
    }
  }, [AllTasks]);

  // Toggle modal visibility
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  // Handle task update from modal
  const handleUpdateTask = (event) => {
    event.preventDefault();
    dispatch(UpdateTask(selectedTask._id, selectedTask));
    handleOpenModal();
  };

  // Handle drag and drop functionality
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceTasks = [...tasks[source.droppableId]];
    const destinationTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : [...tasks[destination.droppableId]];

    // Remove dragged task from source
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId; // Update task status

    // Add task to destination column
    destinationTasks.splice(destination.index, 0, movedTask);

    // Update state
    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });

    // Dispatch API update action
    if (source.droppableId !== destination.droppableId) {
      dispatch(UpdateTask(movedTask._id, { status: movedTask.status }));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
            marginTop: "3%",
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          {["todo", "inProgress", "done"].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: "32%",
                    borderRadius: "10px",
                    backgroundColor: "rgb(231, 231, 231)",
                    boxShadow: "0 4px 8px rgba(11, 5, 5, 0.1)",
                  }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      backgroundColor:
                        status === "todo"
                          ? "red"
                          : status === "inProgress"
                          ? "orange"
                          : "green",
                      color: "white",
                      borderRadius: "10px 10px 0 0",
                      padding: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {status.toUpperCase()}
                  </div>

                  {/* Task List */}
                  <div
                    style={{
                      height: "80vh",
                      overflowY: "scroll",
                      scrollbarWidth: "none",
                    }}
                  >
                    {isTasksLoading ? (
                      <Loading />
                    ) : (
                      tasks[status].map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                setOpenModal={setOpenModal}
                                setSelectedTask={setSelectedTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Task Edit Modal */}
      <Modal open={openModal} onClose={handleOpenModal}>
        <Box
          component="form"
          onSubmit={handleUpdateTask}
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
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Title"
            value={selectedTask?.title}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, title: e.target.value })
            }
            required
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Description"
            value={selectedTask?.description}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, description: e.target.value })
            }
            required
          />
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Due Date"
            value={selectedTask?.dueDate}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, dueDate: e.target.value })
            }
            required
          />
          <Select
            variant="outlined"
            fullWidth
            margin="normal"
            label="Priority"
            name="priority"
            value={selectedTask?.priority}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, priority: e.target.value })
            }
            required
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
          <Button sx={{ mt: 2 }} fullWidth variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
