export const getRedirectUrl = () => {
  if (localStorage.getItem("token")) {
    return "/user/dashboard";
  } else {
    return "/login";
  }
};

export const getUsername = () => {
  return localStorage.getItem("username");
};
