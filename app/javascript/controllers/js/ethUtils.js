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
      // check if chain exists
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      }).then(() => {
        console.log('chain switched');
      }).catch((error) => {
        // chain doesn't exist, prompt user to add it
        if (error.code === 4902) {
          ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainName,
              chainId,
              nativeCurrency,
              rpcUrls,
              blockExplorerUrls,
            }],
          }).then(() => {
            // chain added and user has switched to it
          });
        } else {
          // other error, handle accordingly
        }
      });
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
    console.log(ethereum);
    try {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts;
    } catch (error) {
        notification.showWarningWithButton({ title: "Error", message: "Ya tienes una solicitud en curso, revisa tu bandeja de MetaMask" })
    } finally {
        showLoader(false);

    }
}

export async function personalSign(account, message) {
    console.log(account, message);
    showLoader(true);

    try {
        const signature = await ethereum.request({
            method: "personal_sign",
            params: [message, account],
        });

        console.log("La firma es:", signature);
        return signature;
    } catch (error) {
        console.error("Ha ocurrido un error:", error);
        alert('error')
        return;
    } finally {
        console.log("La petición ha finalizado.");
        showLoader(false);
    }
}


export async function getUuidByAccount(account) {
    const nonceJson = await fetch(`/api/v1/verifyNonce/${account}`).then(
        (response) => response.json()
    );
    console.log(nonceJson, "RES");
    if (!nonceJson) return null;
    const uuid = nonceJson[0].eth_nonce;
    return uuid;
}
