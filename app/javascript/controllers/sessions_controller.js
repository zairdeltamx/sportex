import { Controller } from "@hotwired/stimulus";
import { showModal } from "./js/modal";
import { metamaskIsInstalled, currentChainIsValid, requestAccounts, personalSign, getUuidByAccount } from "./js/ethUtils";
import { notification } from "../react/src/components/alerts/notifications";
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


    connectToEthereum();
    async function connectToEthereum() {
      if (metamaskIsInstalled()) {
        if (await currentChainIsValid()) return;

        // console.log(checkMetamask());
        buttonEthConnect.addEventListener("click", async () => {
          // buttonEthConnect.disabled = true;
          let accounts
          try {
            accounts = await requestAccounts();
            // hacer algo con accounts
          } catch (error) {
            notification.showWarningWithButton({ title: "Error", message: "Ya tienes una solicitud en curso, revisa tu bandeja de MetaMask" })
            throw error; // aquí se propaga la excepción

          }
          const etherbase = accounts[0];
          const nonce = await getUuidByAccount(etherbase);
          if (!nonce) {
            notification.showWarningWithButton({ title: 'User no exist', message: 'Tu usuario no esta registrado porfavor registrate' })
            return;
          }

          const customTitle = "Ethereum on Rails";
          const requestTime = new Date().getTime();
          const message = customTitle + "," + requestTime + "," + nonce;

          let signature
          try {
            signature = await personalSign(etherbase, message);
          } catch (error) {
            notification.showWarningWithButton({ title: "Error", message: "Ah ocurrido un error al obtener tu firma personal en metamask" })
            throw error; // aquí se propaga la excepción

          }
          // if (!signature || !message) {
          //   notification.showWarningWithButton()
          //   return
          // }
          formInputEthMessage.value = message;
          formInputEthAddress.value = etherbase;
          formInputEthSignature.value = signature;
          console.log("Se envia");
          formNewSession.submit();


        });
      } else {
        showModal(true)
        installMetamaskLink.hidden = false;
        buttonEthConnect.innerHTML = "No Ethereum Context Available";
        buttonEthConnect.disabled = true;
      }


    }

  }
}
