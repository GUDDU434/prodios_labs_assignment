import { useEffect } from "react";
import { axiosInstance } from "./axiosInstance";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    console.log(0)
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        console.log(1);
        const token = localStorage.getItem("accessToken");
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(3);
        const prevRequest = error?.config;

        if (
          error?.response?.status === 401 &&
          prevRequest &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true;
          try {
            console.log(4);
            const newAccessToken = await refresh();
            localStorage.setItem("accessToken", newAccessToken);
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(prevRequest); // Retry the failed request
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosInstance;
};

export default useAxiosPrivate;
