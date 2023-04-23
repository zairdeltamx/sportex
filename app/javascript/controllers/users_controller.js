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
      if (await metamaskIsInstalled()) {
        buttonEthConnect.addEventListener("click", async () => {
          await currentChainIsValid()

          let accounts;
          accounts = await requestAccounts();
          // hacer algo con accounts

          const etherbase = accounts[0];

          // Populate the form input and submit the form
          formInputEthAddress.value = etherbase;
          form.submit();
        });
      } else {
        installMetamaskLink.hidden = false;
        showModal(true);
        buttonEthConnect.innerHTML = "No Ethereum Context Available";
      }
    }

    function disableButtonsChainInvalid() {
      // Disable the button and change its text
      buttonEthConnect.innerHTML = "Change chain valid";
      buttonEthConnect.disabled = true;
    }
  }
}
