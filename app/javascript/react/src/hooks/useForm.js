import { useState } from 'react';

function useForm(initialState) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  return { form: formData, handleChange };
}
export default useForm;
