import React, { useState } from 'react';
import { ConfirmUpdate } from '../../components';
import { Button, Title } from '../../components/elements/Elements';
import { updateAvatar } from '../../services/users';
import './styles.css';
export const AvatarProfile = ({ data, fetchUser }) => {
	const [file, setFile] = useState(null);

	// This function detects changes in the input file
	const onChangeAvatar = changeEvent => {
		setFile(changeEvent.target.files[0]);
	};

	// this function modifies the user's avatar
	const handleAvatarUpdate = async () => {
		const formData = new FormData();
		formData.append('avatar', file);
		ConfirmUpdate({
			callback: updateAvatar,
			parameters: { id: data.id, avatar: formData },
			fetch: fetchUser,
		});
	};
	return (
		<div>
			<div className="avatarContainer">
				<Title black>You Profile</Title>
				<div className="contentImgProfile">
					<img
						width='100%'
						height='100%'
						src={data ? data.avatar_url : ''}
						alt=''
					/>
				</div>
				<Title black size='20px'>
					Avatar
				</Title>

				<input
					accept='image/jpg,image/jpeg,image/png'
					type='file'
					onChange={onChangeAvatar}
					name='avatar'
					width={100}
				/>
				<Button
					style={{ marginTop: '10px' }}
					onClick={handleAvatarUpdate}
					disabled={!file}>
					Modify Avatar
				</Button>
			</div>
		</div>
	);
};
