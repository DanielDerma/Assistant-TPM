import { TextField } from '@mui/material';
import React from 'react';

const Input = () => {
  const [value, setValue] = React.useState('');
  const handleChange = (event) => setValue(event.target.value);
  return <TextField id="standard-basic" label="Descripcion" variant="standard" value={value} onChange={handleChange} />;
};

export default Input;
