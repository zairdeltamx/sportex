import axios from "axios";
import { getApiUrl } from "../config";
import { notification } from "../components/alerts/notifications";

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
      window.location.href = "/users/sign_in";
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
      console.log(err, "erro");
    })
    .then((res) => {
      console.log(res, "RESPONSE");
      if (res.status === 200) {
        notification.showSuccess({
          title: "Success",
          message: "Your information has been updated",
        });
        return;
      }
      notification.showWarning({
        title: "Error",
        message: "An error has occurred, please try again",
      });
    });
};

export const updateAvatar = async ({ id, avatar, getUser }) => {
  const apiUrl = getApiUrl(`updateAvatar/${id}`);
  console.log("fasdasasd");
  return axios
    .put(apiUrl, avatar, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(async (res) => {
      notification.showSuccess({
        title: "Success",
        message: "image updated successfully",
      });
      await getUser();
    })
    .catch((err) => {
      notification.showError({
        title: "Error",
        message: "An error occurred while updating the avatar",
      });
    });
};
