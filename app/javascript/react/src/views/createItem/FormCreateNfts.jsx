import React, { Fragment } from 'react';

import './styles.css';
import {
	ContainerInput,
	Input,
	Label,
	TextArea,
	Title,
} from '../../components/elements/Elements';

export const FormCreateNfts = ({
	fileUrl,
	onChange,
	formInput,
	updateFormInput,
}) => {
	return (
		<div className="formCreteItem">
			<ContainerInput>
				<Label htmlFor='name'>Name*</Label>
				<Input
					autoComplete='off'
					placeholder='Name....'
					id='name'
					type='text'
					onChange={e =>
						updateFormInput({ ...formInput, name: e.target.value })
					}
				/>
			</ContainerInput>
			<ContainerInput>
				<Label htmlFor='description'>Description*</Label>
				<Input
					autoComplete='off'
					placeholder='Description....'
					id='description'
					type='text'
					onChange={e =>
						updateFormInput({ ...formInput, description: e.target.value })
					}
				/>
			</ContainerInput>
			<ContainerInput>
				<Label htmlFor='price'>Price*</Label>
				<Input
					autoComplete='off'
					placeholder='2....'
					id='price'
					type='number'
					onChange={e =>
						updateFormInput({ ...formInput, price: e.target.value })
					}
				/>
			</ContainerInput>
			<ContainerInput>
				<Label htmlFor='meta'>Meta_json*</Label>
				<TextArea
					autoComplete='off'
					placeholder='{Meta_json....,Meta_json...}'
					id='meta'
					type='text'
					onChange={e =>
						updateFormInput({ ...formInput, meta: e.target.value })
					}
				/>
			</ContainerInput>
			<div>
				<input required={true} type='file' name='Asset' onChange={onChange} />
			</div>
			<div>
				<Title black>Preview image:</Title>
				{fileUrl && (
					<Fragment>
						<img
							src={fileUrl}
							alt='Picture of the author'
							className='rounded mt-4'
							width={200}
							height={200}
						/>
					</Fragment>
				)}
			</div>
		</div>
	);
};
