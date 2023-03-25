import axios from "axios";
import { getApiUrl } from "../config";

export const getUser = async ({ addressMetamask }:{addressMetamask:string}) => {
  const apiUrl = getApiUrl(`findUser/${addressMetamask}`);

  return axios
    .get(apiUrl)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};
export const updateEmail = ({ address, email }:{address:string,email:string}) => {
  const apiUrl = getApiUrl(`updateEmail/${address}`);
  return axios
    .put(apiUrl, { email })
    .then((res) => res)
    .catch((err) => {
      console.log(err.message);
    });
};
export const updateUsername = async ({ address, username }:{address:string,username:string}) => {
  const apiUrl = getApiUrl(`updateUsername/${address}`);

  return axios
    .put(apiUrl, { username })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
    });
};

export const updateAvatar = ({ id, avatar }:{id:number,avatar:any}) => {
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
