import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const accountsAutorized = ['0x66ee7a3985d5342baae1b7d0ff1bc9fa7ee9182e'];
const addressSlice = createSlice({
	name: 'address',
	initialState: {
		address: '',
		balance: 0,
		Authorized: false,
	},
	reducers: {
		getAddress: (state, action) => {
			state.address = action.payload.address;
			state.balance = action.payload.balanceFormat;
			state.Authorized = action.payload.isAutorized;
		},
	},
});
export const { getAddress } = addressSlice.actions;
export default addressSlice.reducer;

export const setInfoAddressUser = () => async dispatch => {
	const address = await window.ethereum.request({
		method: 'eth_requestAccounts',
	});
	const balance = await window.ethereum.request({
		method: 'eth_getBalance',
		params: [address[0], 'latest'],
	});
	const balanceFormat = ethers.utils.formatEther(balance[0]);
	const isAutorized = accountsAutorized.includes(address[0]);
	// console.log(isAutorized, 'isAutorized');
	dispatch(getAddress({ address: address[0], balanceFormat, isAutorized }));
};
