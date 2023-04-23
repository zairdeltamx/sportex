// ethUtils.js
import {
  chainId,
  chainName,
  nativeCurrency,
  rpcUrls,
  blockExplorerUrls,
} from "./ethConfig.js";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { showLoader } from "./loader.js";
import { notification } from "../../react/src/components/alerts/notifications.js";

export async function currentChainIsValid() {
  try {
    const provider = await detectEthereumProvider();
    const currentChain = await provider.request({ method: "eth_chainId" });
    if (currentChain === chainId) {
      return true;
    }
    await switchChain();
    return false;
  } catch (error) {
    notification.showWarning({
      title: "Error",
      message:
        "There was an error changing the network, check your metamask notifications and reload the page",
    });
    console.log(error);
  }
}

export async function switchChain(button) {
  const provider = await detectEthereumProvider();
  const web3 = new Web3("https://rpc.v3.testnet.pulsechain.com/");
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(chainId) }],
    });
  } catch (error) {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainName,
          chainId: web3.utils.toHex(chainId),
          nativeCurrency,
          rpcUrls,
          blockExplorerUrls,
        },
      ],
    });
    console.log(error);
  }
}

export async function metamaskIsInstalled() {
  showLoader(true);
  const provider = await detectEthereumProvider().finally(() => {
    showLoader(false);
  });

  if (!provider) return false;

  if (provider.isBraveWallet && provider.isMetaMask) return false;
  else if (provider.isMetaMask) return true;
}

export async function requestAccounts() {
  showLoader(true);
  try {
    const provider = await detectEthereumProvider();
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    return accounts;
  } catch (err) {
    notification.showWarningWithButton({
      title: "Error",
      message:
        "Ya tienes una solicitud en curso, revisa tu bandeja de MetaMask",
    });
  } finally {
    showLoader(false);
  }
}

export async function personalSign(account, message) {
  showLoader(true);

  const provider = await detectEthereumProvider();
  return provider
    .request({
      method: "personal_sign",
      params: [message, account],
    })
    .then((signature) => {
      return signature;
    })
    .finally(() => {
      showLoader(false);
    });
}

export async function getUuidByAccount(account) {
  const nonceJson = await fetch(`/api/v1/verifyNonce/${account}`).then(
    (response) => response.json()
  );
  if (!nonceJson) return null;
  const uuid = nonceJson[0].eth_nonce;
  return uuid;
}
