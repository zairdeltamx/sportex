import React from 'react';
import { Select, Stack } from '@chakra-ui/react';

const FilterComponent = ({ filterOptions, selectedFilter, onFilterChange }) => {
  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    onFilterChange(selectedValue);
  };

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      align={['center', 'flex-start']}
    >
      <label>Filter by:</label>
      <Select
        value={selectedFilter}
        onChange={handleFilterChange}
        maxWidth="200px"
      >
        <option value="">All</option>
        {filterOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Stack>
  );
};

export default FilterComponent;
