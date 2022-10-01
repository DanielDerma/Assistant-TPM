import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Switch,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { Stepper } from '../add';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_COMPANY = ['Edificio A', 'Edificio B', 'Edificio C'];
export const FILTER_ROLE = ['Edificio A', 'Edificio B', 'Edificio C'];
export const FILTER_VERIFIED = ['True', 'False'];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ isOpenFilter, onCloseFilter }) {
  const [input, setInput] = useState(10);
  const handleInput = (event) => setInput(event.target.value);
  return (
    <>
      <Drawer
        anchor="right"
        open={isOpenFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 350 }, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtros
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Profundidad de la búsqueda:
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-label"
                  variant="standard"
                  label="Compañía"
                  value={input}
                  onChange={handleInput}
                >
                  <MenuItem value={10}>Compañía</MenuItem>
                  <MenuItem value={20}>Area</MenuItem>
                  <MenuItem value={30}>Maquina</MenuItem>
                  <MenuItem value={40}>Sistema</MenuItem>
                </Select>
              </FormControl>
              {/* <Stepper /> */}
            </div>
            {/* <div>
              <Typography variant="subtitle1" gutterBottom>
                Role
              </Typography>
              <FormGroup>
                {FILTER_ROLE.map((item) => (
                  <FormControlLabel key={item} control={<Checkbox />} label={item} />
                ))}
              </FormGroup>
            </div> */}

            <div>
              {/* <Typography variant="subtitle1" gutterBottom>
                Email Verificado
              </Typography>
              <RadioGroup>
                {FILTER_VERIFIED.map((item) => (
                  <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                ))}
              </RadioGroup> */}
            </div>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
