import { Controller } from "@hotwired/stimulus";
import { currentChainIsValid } from "./js/ethUtils";

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

    async function switchChain() {
      try {
        await currentChainIsValid();
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
