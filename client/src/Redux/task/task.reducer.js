import { TASKS_FAILURE, TASKS_REQUEST, TASKS_SUCCESS } from "./task.action";

const initialTasks = {
  isTasksLoading: false,
  isTasksError: null,
  AllTasks: [],
};

export const reducer = (state = initialTasks, { type, payload }) => {
  switch (type) {
    case TASKS_REQUEST:
      return {
        ...state,
        isTasksLoading: true,
        isTasksError: null,
      };
    case TASKS_SUCCESS:
      return {
        ...state,
        isTasksLoading: false,
        isTasksError: null,
        AllTasks: payload,
      };
    case TASKS_FAILURE:
      return {
        ...state,
        isTasksLoading: false,
        isTasksError: payload,
      };
    default:
      return state;
  }
};
