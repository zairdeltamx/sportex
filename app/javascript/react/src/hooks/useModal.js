import { useState } from "react";

export const useModal = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    console.log(isOpen);
    setIsOpen(false);
  };

  return [isOpen, openModal, closeModal];
};
