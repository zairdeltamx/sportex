import { providers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";

export const useAddress = () => {
  const [Address, setAddress] = useState([
    "0x66ee7A3985D5342BaaE1b7D0FF1BC9FA7Ee9182E",
  ]);

  const [isAutorized, setisAutorized] = useState(false);

  const getaddres = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const ethersProvider = new providers.Web3Provider(connection);
    const userAddress = await ethersProvider.getSigner().getAddress();

    if (Address.includes(userAddress)) {
      setisAutorized(true);
    } else {
      setisAutorized(false);
    }
  };
  getaddres();
  return {
    isAutorized,
  };
};
