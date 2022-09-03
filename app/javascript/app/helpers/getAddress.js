
import { providers } from "ethers"
import Web3Modal from "web3modal"

export const getAddress= async ()=>{
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const ethersProvider = new providers.Web3Provider(connection)
    const userAddress = await ethersProvider.getSigner().getAddress()
    return userAddress
}