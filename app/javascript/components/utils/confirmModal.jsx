import React from 'react'
import { useEffect , useState } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ConfirmModal(props) {
  const [askingPrice, setAskingPrice] = useState(0)
  console.log(props.nft)

  return (
    <Modal show={props.nft}>
      <Modal.Header closeButton>
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
        <Button variant="secondary">Close</Button>
        <Button variant="primary" onClick={() => props.onConfirm(props.nft, askingPrice)} >List for Sale</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
