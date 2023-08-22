import React from 'react';
import styles from './PurchaseButton.module.css';
import { useModal } from '../hooks/useModal';
import { Modal } from './Modal';
import { Checkout } from './Checkout';
export const PurchaseButton = ({ nft, className }) => {
  const [isOpen, openModal, closeModal] = useModal();

  return (
    <>
      <button onClick={openModal} className={styles[className]}>
        BUY IT
      </button>
      {/* {isOpen && ( */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Checkout nft={nft} />
      </Modal>
      {/* )} */}
    </>
  );
};
