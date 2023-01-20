import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="users"
export default class extends Controller {
  connect() {
    console.log("DASLKDJ");
    // the button to connect to an ethereum wallet
    const buttonEthConnectUserNew = document.querySelector('button.eth_connect');

    // the read-only eth address field, we process that automatically
    const formInputEthAddressUserNew = document.querySelector('.eth_address');
    const installMetamaskLinkUserNew = document.querySelector('.linkMetamask');

    installMetamaskLinkUserNew.hidden = true;
    console.log(formInputEthAddressUserNew, "DJASLKDAD");
    // get the user form for submission later
    const formNewUser = document.querySelector('form.new_user');

    // only proceed with ethereum context available
    if (typeof window.ethereum !== 'undefined') {
      buttonEthConnectUserNew.addEventListener('click', async () => {
        buttonEthConnectUserNew.disabled = true;

        // request accounts from ethereum provider
        const accounts = await requestAccounts();
        const etherbase = accounts[0];

        // populate and submit form
        formInputEthAddressUserNew.value = etherbase;
        console.log(formInputEthAddressUserNew, "INPUT");
        formNewUser.submit();
      });
    } else {
      // disable form submission in case there is no ethereum wallet available
      installMetamaskLinkUserNew.hidden = false;
      buttonEthConnectUserNew.innerHTML = 'No Ethereum Context Available';
      buttonEthConnectUserNew.disabled = true;
    }

    // request ethereum wallet access and approved accounts[]
    async function requestAccounts() {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      return accounts;
    }
  }
}
