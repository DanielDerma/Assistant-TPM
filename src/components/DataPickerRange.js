import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

const DataPickerRange = () => {
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day');

  const [initialDate, setInitialDate] = React.useState(yesterday);
  const [finalDate, setFinalDate] = React.useState(today);
  const [input, setInput] = React.useState(10);

  const handleInitialDate = (newDate) => setInitialDate(newDate);
  const handleFinalDate = (newDate) => setFinalDate(newDate);
  const handleInput = (e) => setInput(e.target.value);

  const difference = finalDate.diff(initialDate, 'day');

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          spacing={{ xs: 1, sm: 3 }}
          direction={{ xs: 'column', sm: 'row' }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <DesktopDatePicker
            label="Inicio"
            inputFormat="MM/DD/YYYY"
            value={initialDate}
            onChange={handleInitialDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="Final"
            inputFormat="MM/DD/YYYY"
            value={finalDate}
            onChange={handleFinalDate}
            minDate={initialDate.add(1, 'day')}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">Estatus</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={input}
              label="Estatus"
              onChange={handleInput}
            >
              <MenuItem value={10}>Todos los estatus</MenuItem>
              <MenuItem value={20}>Estatus 1</MenuItem>
              <MenuItem value={30}>Estatus 2</MenuItem>
              <MenuItem value={40}>Estatus 3</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {difference > 0 && (
          <Typography variant="subtitle1" sx={{ ml: 2, mt: 1 }}>
            Dias a Calcular: {difference}
          </Typography>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default DataPickerRange;
