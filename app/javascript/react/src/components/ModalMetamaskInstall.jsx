import React, { useState } from "react"
import MetamaskLogo from '../img/Metamask.svg'
import { LoaderBlock } from "./LoaderBlock";
export const ModalMetamaskInstall = () => {
    const [activeModal, setactiveModal] = useState(true)

    return (
        <div className={`container_modal_metamask_install ${!activeModal ? "activeModal" : ''}`}>
            <div onClick={() => setactiveModal(false)} className="close_modal_metamask"><span>Cerrar X</span></div>
            <div className="content_modal">
                <MetamaskLogo />
                <h1>You need to login with MetaMask</h1>
                <p>It seems you don't have MetaMask installed</p>
                <button><a target="_blank" href="https://metamask.io/download/">Install MetaMask</a></button>
            </div>
        </div>
    );
};
