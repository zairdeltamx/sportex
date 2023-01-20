import axios from 'axios';
import { getApiUrlUsers } from '../config';

export const getUser = async ({ address }) => {
	const apiUrl = getApiUrlUsers(`findUser/${address}`);
	console.log('SI ENTRA');

	return axios
		.get(apiUrl)
		.then(res => res.data)
		.catch(err => {
			console.log(err);
		});
};
export const updateEmail = ({ address, email }) => {
	const apiUrl = getApiUrlUsers(`updateEmail/${address}`);
	return axios
		.put(apiUrl, { email })
		.then(res => res)
		.catch(err => {
			console.log(err.message);
		});
};
export const updateUsername = async ({ address, username }) => {
	const apiUrl = getApiUrlUsers(`updateUsername/${address}`);

	return axios
		.put(apiUrl, { username })
		.then(res => res)
		.catch(err => {
			console.log(err);
		});
};

export const updateAvatar = ({ id, avatar }) => {
	console.log(avatar, 'AVATARaca');
	const apiUrl = getApiUrlUsers(`updateAvatar/${id}`);
	return axios
		.put(apiUrl, avatar, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then(res => res)
		.catch(err => {
			console.log(err);
		});
};
