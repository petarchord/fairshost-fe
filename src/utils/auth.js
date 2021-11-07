export const getRedirectUrl = () => {
  if (localStorage.getItem("token")) {
    return "/user/dashboard";
  } else {
    return "/login";
  }
};
