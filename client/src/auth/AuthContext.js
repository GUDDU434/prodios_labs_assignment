/* eslint-disable */
import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_SUCCESS_METHOD } from "../Redux/auth/auth.actionTypes";
import { axiosInstance } from "../utils/axiosInstance";
import useAxiosPrivate from "../utils/useAxiosPrivate";

// ----------------------------------------------------------------------
// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGIN") {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === "REGISTER") {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axiosPrivate.get("/auth/user", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const user = response.data;

      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: true,
          user,
        },
      });
    } catch (error) {
      navigate("/login");
      dispatch({
        type: "LOGOUT",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [axiosPrivate]);

  // LOGIN
  const login = useCallback(
    async (username, password) => {
      try {
        const response = await axiosInstance.post("/auth/login", {
          username,
          password,
        });
        const { accessToken, refreshToken, role } = response?.data;

        // Save tokens and role in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const user = response?.data;

        dispatch({ type: LOGIN_SUCCESS_METHOD, payload: user });

        dispatch({
          type: "LOGIN",
          payload: {
            user,
          },
        });

        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: true,
            user,
          },
        });
        navigate("/");
      } catch (error) {
        console.error("Login error: ", error);
        throw error;
      }
    },
    [navigate]
  );

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken, refreshToken } = response?.data;

      // Save tokens and role in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const user = response?.data;
      dispatch({
        type: "REGISTER",
        payload: {
          user,
        },
      });
    } catch (error) {
      console.error("Register error: ", error);
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    dispatch({
      type: "LOGOUT",
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: "jwt",
      login,
      register,
      logout,
      initialize,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      logout,
      register,
      initialize,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
