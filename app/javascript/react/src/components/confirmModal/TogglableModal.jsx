import React, { Fragment, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '../elements/Elements';

export const TogglableModal = ({
	children,
	params,
	title,
	buttonLabel,
	onConfirm,
}) => {
	console.log(params, 'PARAMS');
	const [visible, setVisible] = useState(false);
	return (
		<Fragment>
			<Button onClick={() => setVisible(true)}>{buttonLabel}</Button>
			<Modal show={visible}>
				<Modal.Header>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{children}</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setVisible(false)}>
						Close
					</Button>
					<Button
						variant='primary'
						onClick={() => {
							onConfirm(params ? params : null);
						}}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</Fragment>
	);
};
