import { useState } from 'react';

function useForm(initialState) {
	const [formData, setFormData] = useState(initialState);

	const handleChange = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};
	console.log(formData, 'FORM');
	return { form: formData, handleChange };
}
export default useForm;
