// ethUtils.js
import { notification } from "../../react/src/components/alerts/notifications.js";
import { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } from "./ethConfig.js";
import { showLoader } from "./loader.js";

export async function currentChainIsValid() {
    try {
        const currentChain = await ethereum.request({ method: "eth_chainId" });
        if (currentChain === chainId) {
            return true;
        }
        await switchChain()
        return false;
    } catch (error) {
        console.log(error);
    }
}

export async function switchChain() {
    try {

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

    } catch (error) {
      if (error.code === 4902) {
        await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainName,
                    chainId,
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

export function metamaskIsInstalled() {
    if (typeof window.ethereum !== 'undefined') {
        if (ethereum.isMetaMask && !ethereum.isBraveWallet) {
            return true
        } else if (ethereum.isBraveWallet) {
            return false
        }
    } else {
        return false
    }

}

export async function requestAccounts() {
    showLoader(true);
    try {

        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts;

    } finally {
        showLoader(false);

    }
}

export async function personalSign(account, message) {
    showLoader(true);

    return ethereum.request({
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
