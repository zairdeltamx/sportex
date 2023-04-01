import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="users"
export default class extends Controller {
  connect() {
    // The button to connect to an Ethereum wallet
    const buttonEthConnect = document.querySelector(".ButtonEthConnect");

    // The read-only eth address field, we process that automatically
    const formInputEthAddress = document.querySelector(".eth_address");
    const installMetamaskLink = document.querySelector(".linkMetamask");

    // Hide the install Metamask link
    installMetamaskLink.hidden = true;

    // Get the form for submission later
    const form = document.querySelector("form.new_user");
    const chainName = "Pulsechain Testnet";
    const chainId = "0x3ae";
    const nativeCurrency = { name: "tPulse", decimals: 18, symbol: "tPLS" };
    const blockExplorerUrls = ["https://scan.v3.testnet.pulsechain.com"];
    const rpcUrls = ["https://rpc.v3.testnet.pulsechain.com/"];

    async function checkCurrentChainId() {
      try {
        const currentChain = await ethereum.request({ method: "eth_chainId" });
        console.log("checkCurrentChainId", currentChain);
        if (currentChain !== chainId) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
      }
    }
    async function switchChain() {
      try {
        console.log(await checkCurrentChainId());
        if (await checkCurrentChainId()) {
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
      // Check if Ethereum context is available
      if (checkMetamask()) {
        await switchChain();
        if (await checkCurrentChainId()) return;

        // Add event listener to the button
        buttonEthConnect.addEventListener("click", async () => {
          // Disable the button
          buttonEthConnect.disabled = true;

          // Request accounts from Ethereum provider
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const etherbase = accounts[0];

          // Populate the form input and submit the form
          formInputEthAddress.value = etherbase;
          form.submit();
        });
      } else {
        // Show the install Metamask link
        installMetamaskLink.hidden = false;
        // Disable the button and change its text
        buttonEthConnect.innerHTML = "No Ethereum Context Available";
        buttonEthConnect.disabled = true;
      }
    }
  }
}
