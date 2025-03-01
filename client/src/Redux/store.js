import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { reducer as loginReducer } from "./auth/auth.reducer";
import { reducer as Task } from "./task/task.reducer";

let rootReducer = combineReducers({
  loginReducer,
  Task,
});
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
