// GraphqlContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const GraphqlContext = createContext({
  currentPage: '',
  setCurrentPage: (state) => {},
  variables: {},
  setVariables: (state) => {},
});
export function useGraphqlContext() {
  return useContext(GraphqlContext);
}

export function GraphqlProvider({ children }) {
  const [variables, setVariables] = useState({});
  const [currentPage, setCurrentPage] = useState(2);
  useEffect(() => {
    console.log(currentPage, 'CURRENT PAGE');
  }, [currentPage]);

  const contextValue = {
    currentPage,
    setCurrentPage,
    variables,
    setVariables,
  };

  return (
    <GraphqlContext.Provider value={contextValue}>
      {children}
    </GraphqlContext.Provider>
  );
}
