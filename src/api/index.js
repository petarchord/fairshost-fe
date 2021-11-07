import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(
  (request) => {
    let token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    console.log("token:", token);
    request.headers["Content-Type"] = "application/json";
    request.headers["Authorization"] = `Bearer ${token}`;
    console.log("request in interceptor:", request);
    return request;
  },
  (error) => {
    console.log("error in request interceptor:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 403) {
      localStorage.removeItem("token");
      window.location = "/login";
    }

    return Promise.reject(error);
  }
);

export const registerUser = (data) => {
  return axios.post("user/register", data);
};

export const loginUser = (data) => {
  return axios.post("user/login", data);
};
