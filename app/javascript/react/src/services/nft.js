import axios from "axios";
import { getApiUrl } from "../config";

export const deleteNft = async ({ id }) => {
  console.log(id, "ID");
  console.log(typeof id);

  const apiUrl = getApiUrl(`nfts/${id}`);
  await axios.delete(apiUrl);
};

export const checkStatusNft = async ({ id }) => {
  console.log(id, "DATIS");
  try {
    const apiUrl = getApiUrl(`nfts/${id}/status`);
    const response = await axios.get(apiUrl);
    console.log(response.data, "DATA");
    return response.data.json.status;
  } catch (error) {
    // Manejo de errores
    console.error("Error al verificar el estado del NFT:", error);
    throw error;
  }
};
