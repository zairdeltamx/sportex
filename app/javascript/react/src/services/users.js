import axios from "axios";
import { getApiUrl } from "../config";

export const getUser = async ({ addressMetamask }) => {
  const apiUrl = getApiUrl(`findUser/${addressMetamask}`);

  return axios
    .get(apiUrl)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};
export function logout() {
  fetch("/users/sign_out", {
    // fetch("https://sportex-staging.herokuapp.com/users/sign_out", {
    method: "GET",
  })
    .then(() => {

      // window.location.href = "/users/sign_in";
    })
    .catch((errs) => {
      console.log(errs);
    });
}
export const updateUser = ({ address, email, username }) => {
  const apiUrl = getApiUrl(`updateUser/${address}`);

  const requestData = { address };
  if (email) {
    requestData.email = email;
  }
  if (username) {
    requestData.username = username;
  }

  return axios
    .put(apiUrl, requestData)
    .then((res) => res)
    .catch((err) => {
      console.log(err.message);
    });
};


export const updateAvatar = ({ id, avatar }) => {
  const apiUrl = getApiUrl(`updateAvatar/${id}`);
  return axios
    .put(apiUrl, avatar, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
    });
};
