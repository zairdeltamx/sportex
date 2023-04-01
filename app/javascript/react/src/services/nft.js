import axios from "axios";
import { getApiUrl } from "../config";



export const deleteNft = async ({ id }) => {
  console.log(id,"ID");
  console.log(typeof id);

  const apiUrl = getApiUrl(`delete_nft/${id}`);
  await axios.delete(apiUrl);
};
