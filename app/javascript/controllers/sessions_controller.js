import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="sessions"
export default class extends Controller {
  connect() {
    const buttonEthConnect = document.querySelector(".ButtonEthConnect");
    const formInputEthMessage = document.querySelector("input.eth_message");
    const formInputEthAddress = document.querySelector("input.eth_address");
    const formInputEthSignature = document.querySelector("input.eth_signature");
    const formNewSession = document.querySelector("form");
    const installMetamaskLink = document.querySelector(".linkMetamask");
    formInputEthMessage.hidden = true;
    formInputEthAddress.hidden = true;
    installMetamaskLink.hidden = true;
    formInputEthSignature.hidden = true;
    const chainNameBinance = "Binance Smart Chain";
    const chainIdBinance = "0x38";
    const nativeCurrencyBinance = { name: "BNB", decimals: 18, symbol: "BNB" };
    const blockExplorerUrlsBinance = ["https://bscscan.com/"];
    const rpcUrlsBinance = ["https://bsc-dataseed.binance.org/"];
    async function checkCurrentChainId() {
      try {
        const currentChain = await ethereum.request({ method: "eth_chainId" });
        if (currentChain !== chainIdBinance) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
      }
    }
    async function switchChain() {
      try {
        if (await checkCurrentChainId()) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: chainNameBinance,
                chainId: chainIdBinance,
                nativeCurrency: nativeCurrencyBinance,
                rpcUrls: rpcUrlsBinance,
                blockExplorerUrls: blockExplorerUrlsBinance,
              },
            ],
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    function checkMetamask() {
      if (typeof window.ethereum !== "undefined") {
        return true;
      }
      return false;
    }

    connectToEthereum();
    async function connectToEthereum() {
      if (checkMetamask()) {
        await switchChain();
        console.log(!(await checkCurrentChainId(), "DKASDL"));
        if (await checkCurrentChainId()) return;

        // console.log(checkMetamask());
        buttonEthConnect.addEventListener("click", async () => {
          buttonEthConnect.disabled = true;
          const accounts = await requestAccounts();
          const etherbase = accounts[0];
          const nonce = await getUuidByAccount(etherbase);
          if (nonce === null) {
            alert("NO ESTAS REGISTRADO");
            return;
          }
          if (nonce) {
            const customTitle = "Ethereum on Rails";
            const requestTime = new Date().getTime();
            const message = customTitle + "," + requestTime + "," + nonce;
            const signature = await personalSign(etherbase, message);
            console.log(signature, "SIGNATURE");
            formInputEthMessage.value = message;
            formInputEthAddress.value = etherbase;
            formInputEthSignature.value = signature;
            console.log("Se envia");
            formNewSession.submit();
          } else {
            formInputEthMessage.value = "Please sign up first!";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You dont have metamask installed!",
          footer:
            '<a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">Do you want to install it?</a>',
        });
        installMetamaskLink.hidden = false;
        buttonEthConnect.innerHTML = "No Ethereum Context Available";
        buttonEthConnect.disabled = true;
      }
    }

    async function requestAccounts() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts;
    }

    async function personalSign(account, message) {
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, account],
      });
      return signature;
    }

    async function getUuidByAccount(account) {
      const nonceJson = await fetch(`/api/v1/users/${account}`).then(
        (response) => response.json()
      );
      console.log(nonceJson, "RES");
      if (!nonceJson) return null;
      const uuid = nonceJson[0].eth_nonce;
      return uuid;
    }
  }
}
