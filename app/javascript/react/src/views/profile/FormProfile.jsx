import React, { Fragment, useEffect, useState } from 'react';
import {
	ButtonWithSubmit,
	ContainerInput,
	Errors,
	GroupInputWithButton,
	InputWithButton,
	Label,
} from '../../components/elements/Elements';
import { ConfirmUpdate } from '../../components/index';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { updateEmail, updateUsername } from '../../services/users';
// Redux

export const FormProfile = ({ address, initialForm, balance, data }) => {
	console.log(data, 'ADD');
	const {
		register,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: initialForm,
		mode: 'onChange',
	});
	console.log(errors, 'ERRORS');

	return (
		<Fragment>
			<form className="formProfile">
				<ContainerInput>
					<Label htmlFor='username'>Username</Label>
					<GroupInputWithButton>
						<InputWithButton
							{...register('username', {
								required: true,
								minLength: 5,
							})}
							autoComplete='off'
							id='username'
							type='text'
						/>
						<ButtonWithSubmit
							type='button'
							disabled={errors.username}
							onClick={() =>
								ConfirmUpdate({
									callback: updateUsername,
									parameters: {
										address,
										username: watch('username'),
									},
								})
							}>
							<FontAwesomeIcon icon='fa-solid fa-pen-to-square' />
						</ButtonWithSubmit>
					</GroupInputWithButton>
					<Errors>
						{errors.username &&
							errors.username.type === 'required' &&
							'Username is required'}
					</Errors>
					<Errors>
						{errors.username &&
							errors.username.type === 'minLength' &&
							'Minimum 5 characters'}
					</Errors>
				</ContainerInput>

				<ContainerInput>
					<Label htmlFor='email'>Email</Label>
					<GroupInputWithButton>
						<InputWithButton
							{...register('email', {
								required: true,
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								},
							})}
							autoComplete='off'
							id='email'
							type='text'
						/>
						<ButtonWithSubmit
							disabled={errors.email}
							type='button'
							onClick={() =>
								ConfirmUpdate({
									callback: updateEmail,
									parameters: {
										address,
										email: watch('email'),
									},
								})
							}>
							<FontAwesomeIcon icon='fa-solid fa-pen-to-square' />
						</ButtonWithSubmit>
					</GroupInputWithButton>
					<Errors>
						{errors.email &&
							errors.email.type === 'pattern' &&
							'Email is invalid'}
					</Errors>
					<Errors>
						{errors.email &&
							errors.email.type === 'required' &&
							'Email is required'}
					</Errors>
				</ContainerInput>
			</form>
		</Fragment>
	);
};
