import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(value, itemValue, theme) {
  return {
    fontWeight: itemValue.includes(value)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect(props) {
  const theme = useTheme();
  const { items, selectedItems, setSelectedItems, name, sx } = props;
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedItems(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={sx}>
        <InputLabel id="multiple-select-label">{name}</InputLabel>
        <Select
          labelId="multiple-select-label"
          id="multiple-select"
          multiple
          value={selectedItems}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-select" label={name} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items && items.length > 1 && items.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, selectedItems, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}