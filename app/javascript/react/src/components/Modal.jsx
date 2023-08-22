import React, { Fragment, useContext, useState, useEffect } from 'react';
import styles from './Modal.module.css';

export const Modal = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div className={styles.overlayModal}></div>
      <div className={styles.containerModal}>
        <div className={styles.content}>{children}</div>

        <br />
        <br />
        <button className={styles.buttonClose} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
