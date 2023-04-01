import axios from "axios";
import { getApiUrl } from "../config";

export const markAsSold = async ({ id }) => {
  console.log(id,"ID");
  console.log(typeof id);

  const apiUrl = getApiUrl(`nfts/${id}`);
  await axios.delete(apiUrl);
};
