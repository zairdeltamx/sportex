import React, { createContext, useState, useContext, useEffect } from "react";

const MetamaskContext = createContext({
    addressMetamask: "",
    setAddressMetamask: () => { },
    isAllowed: false
});

export const useMetamask = () => useContext(MetamaskContext);

export const MetamaskProvider = ({ children }) => {
    const accountsAllowed = ['0x66ee7A3985D5342BaaE1b7D0FF1BC9FA7Ee9182E', '0x85F6958a2b373a503A4fEDA6f48ab60e1B6d0D28']
    const [addressMetamask, setAddressMetamask] = useState("");
    const [isAllowed, setisAllowed] = useState(false)
    useEffect(() => {
        const getAddress = async () => {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const accountsLower = accountsAllowed.map(account => account.toLowerCase());

            setisAllowed(accountsLower.includes(accounts[0]))
            setAddressMetamask(accounts[0]);
        };

        if (window.ethereum) {
            getAddress();
        } else {
            console.log("Metamask not detected");
        }
    }, []);

    return (
        <MetamaskContext.Provider value={{ addressMetamask, setAddressMetamask, isAllowed }}>
            {children}
        </MetamaskContext.Provider>
    );
};
