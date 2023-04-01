import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { TogglableModal } from '../../components/index';

export const ModalResell = ({ nft, onConfirm }) => {
	const [askingPrice, setAskingPrice] = useState(0);
	console.log(nft, 'NFTMODAL');
	return (
		<TogglableModal
			onConfirm={onConfirm}
			params={{ nft: nft, askingPrice: askingPrice }}
			title='Enter asking price for NFT'
			buttonLabel='Resell'>
			<Form>
				<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
					<Form.Label>Asking Price:</Form.Label>
					<Form.Control
						type='number'
						placeholder='2 PLS'
						onChange={e => setAskingPrice(e.target.value)}
						autoFocus
					/>
				</Form.Group>
			</Form>
		</TogglableModal>
	);
};
