import React, { createContext, useContext } from "react";

// Crea el contexto
const NftContext = createContext();

// Crea un componente personalizado para acceder al contexto
export function useNftContext() {
  return useContext(NftContext);
}

export default NftContext;
