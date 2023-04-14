// ethUtils.js
import { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } from "./ethConfig.js";
import { Web3 } from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { showLoader } from "./loader.js";

export async function currentChainIsValid() {
    try {
        const provider = await detectEthereumProvider();
        const currentChain = await provider.request({ method: "eth_chainId" });
        if (currentChain === chainId) {
            alert("You are on the correct network");
            return true;
        }
        await switchChain()
        return false;
    } catch (error) {
        console.log(error);
    }
}

export async function switchChain() {
    alert("You are on the wrong network. Switching to the correct network");
    const provider = await detectEthereumProvider();
    const web3 = new Web3('https://rpc.v3.testnet.pulsechain.com/');

    alert("Switching to the correct network");
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(chainId) }],
      });
    } catch (error) {
      alert(error)
      if (error.code === 4902) {
        await provider.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainName,
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency,
                    rpcUrls,
                    blockExplorerUrls
                },
            ],
        });
      }
      console.log(error);
    }
}

export async function metamaskIsInstalled() {
    const provider = await detectEthereumProvider();

    if (provider) {
      return true
    } else {
        return false
    }

}

export async function requestAccounts() {
    showLoader(true);
    try {

        const provider = await detectEthereumProvider();
        const accounts = await provider.request({
            method: "eth_requestAccounts",
        });
        return accounts;

    } finally {
        showLoader(false);

    }
}

export async function personalSign(account, message) {
    showLoader(true);

    const provider = await detectEthereumProvider();
    return provider.request({
        method: "personal_sign",
        params: [message, account],
    }).then((signature) => {
        return signature
    }).finally(() => {
        showLoader(false);
    })
}


export async function getUuidByAccount(account) {
    const nonceJson = await fetch(`/api/v1/verifyNonce/${account}`).then(
        (response) => response.json()
    );
    if (!nonceJson) return null;
    const uuid = nonceJson[0].eth_nonce;
    return uuid;
}
