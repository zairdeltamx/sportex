import axios from "axios";
import { getApiUrl } from "../config";

export const deleteNft = async ({ id }:{id:number}) => {
  console.log(id);
  const apiUrl = getApiUrl(`delete_nft/${id}`);
  await axios.delete(apiUrl);
};