import React from 'react'
import { useEffect , useState } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ConfirmModal({setDisplayModal,displayModal,onConfirm,nft}) {
  const [askingPrice, setAskingPrice] = useState(0)
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {setShow(false);setDisplayModal(false)};

  const checkNft = () => {
    if (displayModal==true) {

      handleShow()
      console.log(show,"show");

      // setShow(false)
    }else{
      return
    }
    
  };
  useEffect(() => {
    checkNft()
    return () => {
      
    };
  }, [displayModal]);
  return (
    <Modal show={show}>
      <Modal.Header >
        
        <Modal.Title>Enter Asking Price for NFT</Modal.Title>

      </Modal.Header>

      <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Asking Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="2 PLS"
                onChange={(e) => setAskingPrice(e.target.value)}
                autoFocus
              />
            </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        <Button variant="primary" onClick={() => {onConfirm(nft, askingPrice);handleClose()}} >List for Sale</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
