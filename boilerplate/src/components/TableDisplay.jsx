import React, { useMemo } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCustomer } from '../redux/customerSlice';

import { MaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { RingProgress, Text, Box, Button } from '@mantine/core';

const localTheme = createTheme({
  shadows: Array(25).fill('none').map((_, i) =>
    i === 2 ? '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)' : 'none'
  ),
  spacing: (factor) => `${0.25 * factor}rem`,
});

export default function TableDisplay({ customerList, fetchedPofileCompleteness }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileCompletion = (percentage) => {
    return (
      <Box>
        <RingProgress
          size={50}
          thickness={5}
          sections={[{ value: percentage, color: (percentage > 25 ? '#1D9B25' : percentage > 50 ? '#CFA400' : '#D85972') }]}
          label={
            <Text color="" weight={20} align="center" size="xs">
              {percentage}%
            </Text>
          }
        />
      </Box>
    );
  }

  const buttonClick = (customer) => {
    navigate('/dashboard');
    dispatch(setCurrentCustomer(customer));
  }

  const columns = useMemo(
    () => [
      {
        id: 'customerInfo',
        header: 'Customer Info',
        columns: [
          {
            accessorFn: (row) => `${row.profiling?.personal_details?.full_name}`,
            id: 'name',
            header: 'Name',
            maxSize: 50
          },
          {
            accessorFn: (row) => `CLID${row.id.substr(0, 6)}....`,
            id: 'customerId',
            header: 'Customer Id',
            maxSize: 50
          },
          {
            accessorKey: 'email',
            header: 'Email',
            maxSize: 50
          },
          {
            accessorKey: 'source',
            header: 'Source',
          },
          {
            accessorKey: 'mobile',
            header: 'Mobile',
            maxSize: 50
          },
          {
            accessorFn: (row) => !fetchedPofileCompleteness ? 'Loading...' : profileCompletion(row.profile_completion),
            id: 'profileCompletion',
            header: 'Profile Completion',
            maxSize: 50
          },
          {
            id: 'action',
            header: '',
            Cell: ({ row }) => (
              <Button
                variant={'gradient'}
                gradient={{ from: 'indigo', to: 'cyan' }}
                onClick={() => buttonClick(row.original)}
              >
                View
              </Button>
            ),
          }
        ],
      },
    ],
    [fetchedPofileCompleteness]
  );

  return (
    <Box p={10}>
    <ThemeProvider theme={localTheme}>
      <MaterialReactTable
        columns={columns}
        data={customerList}
        enableColumnOrdering
        enablePinning
          muiTableProps={{
    sx: {
      tableLayout: 'fixed',
    },
  }}
      />
    </ThemeProvider>
</Box>
  );
}
