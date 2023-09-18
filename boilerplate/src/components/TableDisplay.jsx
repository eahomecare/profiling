import React, { useMemo } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCustomer } from '../redux/customerSlice';

import { MRT_FullScreenToggleButton, MRT_ShowHideColumnsButton, MRT_ToggleFiltersButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { RingProgress, Text, Box, Button, Center, ActionIcon, Flex, Group, Stack } from '@mantine/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { IconTableExport } from '@tabler/icons-react';

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
          defaultColumn={{
            minSize: 50,
            maxSize: 80
          }}
          enableColumnActions={false}
          enableDensityToggle={false}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          renderToolbarInternalActions={({ table }) => (
            <Stack >
              <Flex justify={'end'}>
                <Box
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                  sx={{ 'cursor': 'pointer' }}
                  mr={'7%'}
                >
                  <Center >
                    <ActionIcon c={'blue'} size={'sm'} ><IconTableExport /></ActionIcon>
                    <Text fw={'bold'} c={'blue'} size={'sm'}>Export</Text>
                  </Center>
                </Box>
              </Flex>
              <Box mt={-22}>
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_FullScreenToggleButton table={table} />
              </Box>
            </Stack>
          )}
        />
      </ThemeProvider>
    </Box>
  );
}