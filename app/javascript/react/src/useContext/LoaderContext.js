import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
    transactionIsLoading: false,
    setTransactionIsLoading: (state) => { }
});

export function useLoadingContext() {
    return useContext(LoadingContext)
}
export const LoadingProvider = ({ children }) => {
    const [transactionIsLoading, setTransactionIsLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{ transactionIsLoading, setTransactionIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
