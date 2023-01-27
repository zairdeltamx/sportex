import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './slices/addressSlice/addressSlice';
export const store = configureStore({
	reducer: {
		addressReducer,
	},
});
