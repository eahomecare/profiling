import React, { useMemo } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCustomer } from '../redux/customerSlice';

import { MaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { RingProgress, Text, Box, Button } from '@mantine/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const localTheme = createTheme({
  shadows: Array(25).fill('none').map((_, i) =>
    i === 2 ? '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)' : 'none'
  ),
  spacing: (factor) => `${0.25 * factor}rem`,
});

export default function TableDisplay({ customerList, fetchedPofileCompleteness }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "exported_customers",
  });

  const handleExportRows = (rows) => {
    const csv = generateCsv(csvConfig)(rows.map(row => row.original));
    download(csvConfig)(csv);
  };

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
  };

  const buttonClick = (customer) => {
    navigate('/dashboard');
    dispatch(setCurrentCustomer(customer));
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.profiling?.personal_details?.full_name}`,
        id: 'name',
        header: 'Name',
        onClick:((row) => buttonClick(row.original))

      },
      {
        accessorFn: (row) => `CLID${row.id.substr(0, 6)}....`,
        id: 'customerId',
        header: 'Customer Id',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'source',
        header: 'Source',
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
      },
      {
        accessorFn: (row) => !fetchedPofileCompleteness ? 'Loading...' : profileCompletion(row.profile_completion),
        id: 'profileCompletion',
        header: 'Profile Completion',
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
    [fetchedPofileCompleteness]
  );


  return (
    <Box p={10}>
      <ThemeProvider theme={localTheme}>
        <MaterialReactTable
          columns={columns}
          data={customerList}
          enableColumnActions={false}
          enableDensityToggle={false}
          enableRowSelection
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
            >
              <Button
                disabled={table.getRowModel().rows.length === 0}
                onClick={() => handleExportRows(table.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export Page Rows
              </Button>
            </Box>
          )}
        />
      </ThemeProvider>
    </Box>
  );
}