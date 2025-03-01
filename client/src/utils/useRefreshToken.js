/* eslint-disable */
import { axiosInstance } from "./axiosInstance";

const useRefreshToken = () => {
  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken") || "";
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken,
    });

    localStorage.setItem("accessToken", response?.data?.accessToken);
    return response?.data?.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
