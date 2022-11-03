import PropTypes from 'prop-types';
import { useReducer } from 'react';

// material
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

export const FILTER_CARDS_OPTIONS = [
  {
    title: 'Mantenimiento',
    value: 'maintenance',
  },
  {
    title: 'Operación',
    value: 'operation',
  },
  {
    title: 'Seguridad',
    value: 'security',
  },
];

const RISK = [
  { title: 'Poco', value: 10 },
  { title: 'Medio', value: 20 },
  { title: 'Alto', value: 30 },
  { title: 'Muy Alto', value: 40 },
  { title: 'Extremo', value: 50 },
];

// ----------------------------------------------------------------------
const INITIAL_INPUT = {
  cards: FILTER_CARDS_OPTIONS.reduce((obj, item) => {
    obj[item.value] = false;
    return obj;
  }, {}),
  risk: RISK.reduce((obj, item) => {
    obj[item.value] = false;
    return obj;
  }, {}),
};

function reducerInput(state, action) {
  switch (action.type) {
    case 'reset':
      return INITIAL_INPUT;
    case 'toggle':
      return { ...state, [action.name]: { ...state[action.name], [action.value]: !state[action.name][action.value] } };
    default:
      throw new Error();
  }
}

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ isOpenFilter, onCloseFilter }) {
  const [input, setInput] = useReducer(reducerInput, INITIAL_INPUT);

  const submitCloseAndReset = () => {
    const cards = Object.keys(input.cards).filter((key) => input.cards[key]);
    const riskString = Object.keys(input.risk).filter((key) => input.risk[key]);
    const risk = riskString.map((item) => parseInt(item, 10));
    onCloseFilter({
      cards: cards.length === 0 ? ['maintenance', 'operation', 'security'] : cards,
      risk: risk.length === 0 ? [10, 20, 30, 40, 50] : risk,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={isOpenFilter}
      onClose={submitCloseAndReset}
      PaperProps={{
        sx: { width: 280, border: 'none', overflow: 'hidden' },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Filters
        </Typography>
        <IconButton onClick={submitCloseAndReset}>
          <Iconify icon="eva:close-fill" width={20} height={20} />
        </IconButton>
      </Stack>

      <Divider />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Carta
            </Typography>
            <FormGroup>
              {FILTER_CARDS_OPTIONS.map((item) => (
                <FormControlLabel
                  key={item.value}
                  control={<Checkbox />}
                  label={item.title}
                  checked={input.cards[item.value]}
                  onClick={() => setInput({ type: 'toggle', name: 'cards', value: item.value })}
                />
              ))}
            </FormGroup>
          </div>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Riesgo
            </Typography>
            <FormGroup>
              {RISK.map((item) => (
                <FormControlLabel
                  key={item.value}
                  control={<Checkbox />}
                  label={item.title}
                  checked={input.risk[item.value]}
                  value={item.value}
                  onClick={() => setInput({ type: 'toggle', name: 'risk', value: item.value })}
                />
              ))}
            </FormGroup>
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
          onClick={() => setInput({ type: 'reset' })}
        >
          Limpiar todo
        </Button>
      </Box>
    </Drawer>
  );
}
