import {
  LOGIN_REQUEST_METHOD,
  LOGIN_SUCCESS_METHOD,
  LOGIN_FAILURE_METHOD,
  USER_SUCCESS_METHOD,
} from "./auth.actionTypes";

const initialState = {
  isLoading: false,
  isError: null,
  profile: {},
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_REQUEST_METHOD:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case LOGIN_SUCCESS_METHOD:
      return {
        ...state,
        isLoading: false,
        isError: null,
        profile: payload,
      };
    case LOGIN_FAILURE_METHOD:
      return {
        ...state,
        isLoading: false,
        isError: payload,
      };
    case USER_SUCCESS_METHOD:
      return {
        ...state,
        isLoading: false,
        isError: null,
        profile: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoading: false,
        isError: null,
        profile: {},
      };
    default:
      return state;
  }
};
