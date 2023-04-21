import { Controller } from "@hotwired/stimulus";
import {
  metamaskIsInstalled,
  currentChainIsValid,
  requestAccounts,
  personalSign,
  getUuidByAccount,
} from "./js/ethUtils";
import { notification } from "../react/src/components/alerts/notifications";
import { showModal } from "./js/modal";

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

    connectToEthereum();
    async function connectToEthereum() {
      // Check if Ethereum context is available
      if (await metamaskIsInstalled()) {
        if (!(await currentChainIsValid())) return;

        // Add event listener to the button
        buttonEthConnect.addEventListener("click", async () => {
          // Disable the button
          // buttonEthConnect.disabled = true;

          let accounts;
          try {
            accounts = await requestAccounts();
            // hacer algo con accounts
          } catch (error) {
            notification.showWarningWithButton({
              title: "Error",
              message:
                "Ya tienes una solicitud en curso, revisa tu bandeja de MetaMask",
            });
            throw error; // aquí se propaga la excepción
          }
          const etherbase = accounts[0];

          // Populate the form input and submit the form
          formInputEthAddress.value = etherbase;
          form.submit();
        });
      } else {
        // Show the install Metamask link
        installMetamaskLink.hidden = false;
        showModal(true);

        // Disable the button and change its text
        buttonEthConnect.innerHTML = "No Ethereum Context Available";
        buttonEthConnect.disabled = true;
      }
    }
  }
}
