import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../Components/Navbar/Navbar";
import Login from "../Pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import Home from "../Pages/Dashboard/Home ";

const Routing = () => {
  const { isAuthenticated, initialize } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      initialize();
    } else if (!isAuthenticated && !initialize) {
      navigation("/login");
    }
  }, [navigation, isAuthenticated, initialize]);

  return (
    <>
      {isAuthenticated ? (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Box component="main" sx={{ flexGrow: 2, p: 3 }}>
            <Navbar onOpen={handleSidebarToggle} />
            <Box>
              <Routes>
                <Route
                  element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
                >
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={() => <h1>404 Page Not Found</h1>} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  );
};

export default Routing;
