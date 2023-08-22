import React, { Fragment, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './ModalChangePriceNft.module.css';
import { Box, Button } from '@mui/material';
export const ModalChangePriceNft = ({
  children,
  title,
  buttonLabel,
  askingPrice,
  onConfirm,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <Fragment>
      <button className={styles.toogleButton} onClick={() => setVisible(true)}>
        {buttonLabel}
      </button>
      <Modal show={visible}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={() => setVisible(false)}>
              Close
            </Button>
            <Button
              disabled={!askingPrice}
              variant="contained"
              onClick={() => {
                setVisible(false);
                onConfirm();
              }}
            >
              Confirm
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
