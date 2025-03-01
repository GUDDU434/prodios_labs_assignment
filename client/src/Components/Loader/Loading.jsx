import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
