import axios from "axios";
import { getApiUrl } from "../config";

export const getUser = async ({ address }) => {
  const apiUrl = getApiUrl(`findUser/${address}`);

  return axios
    .get(apiUrl)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};
export const updateEmail = ({ address, email }) => {
  const apiUrl = getApiUrl(`updateEmail/${address}`);
  return axios
    .put(apiUrl, { email })
    .then((res) => res)
    .catch((err) => {
      console.log(err.message);
    });
};
export const updateUsername = async ({ address, username }) => {
  const apiUrl = getApiUrl(`updateUsername/${address}`);

  return axios
    .put(apiUrl, { username })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
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
