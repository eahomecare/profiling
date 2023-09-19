import React, { useMemo } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCustomer } from '../redux/customerSlice';

import { MRT_FullScreenToggleButton, MRT_ShowHideColumnsButton, MRT_ToggleFiltersButton, MRT_ToggleGlobalFilterButton, MaterialReactTable } from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material';
import { RingProgress, Text, Box, Button, Center, ActionIcon, Flex, Group, Stack, useMantineTheme, Loader } from '@mantine/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { IconTableExport } from '@tabler/icons-react';


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

  const theme = useMantineTheme()

  const localTheme = createTheme({
    shadows: Array(25).fill('none').map((_, i) =>
      i === 2 ? '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)' : 'none'
    ),
    spacing: (factor) => `${0.25 * factor}rem`,
    palette: {
      background: {
        default: '#00000000'
        // theme.colorScheme == "light" ? "#F1F5F9" : "#25262B",
      },
      text: {
        primary:
          theme.colorScheme == "light" ? "#0E0E0F" : "#A6A7AB"

      },
    },

  });

  const profileCompletion = (percentage) => {
    return (
      <Box>
        <RingProgress
          size={45}
          thickness={3}
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
      },
      {
        accessorFn: (row) => `CLID${row.id.substr(0, 6)}....`,
        id: 'customerId',
        header: 'Customer Id',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        minSize: 400
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
        accessorFn: (row) => !fetchedPofileCompleteness ? <Loader color="#4E70EA" type="dots" /> : profileCompletion(row.profile_completion),
        id: 'profileCompletion',
        header: 'Profile Completion',
      },
      // {
      //   id: 'action',
      //   header: '',
      //   Cell: ({ row }) => (
      //     <Button
      //       variant={'gradient'}
      //       gradient={{ from: 'indigo', to: 'cyan' }}
      //       onClick={() => buttonClick(row.original)}
      //     >
      //       View
      //     </Button>
      //   ),
      // }
    ],
    [fetchedPofileCompleteness]
  );


  return (
    <Box >
      <ThemeProvider theme={localTheme}>
        <MaterialReactTable
          columns={columns}
          data={customerList}
          // defaultColumn={{
          //   minSize: 50,
          //   maxSize: 100
          // }}
          enableColumnActions={false}
          enableDensityToggle={false}
          state={{ density: 'compact' }}
          initialState={{ density: 'compact' }}
          muiTableProps={{
            sx: {
              tableLayout: 'fixed',
            },
          }}
          muiTablePaperProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: theme.colorScheme == "light" ? "#F1F5F9" : "#25262B",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => buttonClick(row.original),
            sx: {
              cursor: 'pointer',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(0.99)',
                backgroundColor: '#DDE5FF'
              },
            },
          })}
          muiTableBodyCellProps={
            {
              sx: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            }
          }
          muiTableHeadRowProps={{
            sx: {
              backgroundColor: '#4E70EA30'
            }
          }}
          muiTablePaginationProps={{
            sx: {
              color: '#4E70EA'
            }
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
                    <ActionIcon c={'#4E70EA'} size={'sm'} ><IconTableExport /></ActionIcon>
                    <Text fw={'bold'} c={'#4E70EA'} size={'sm'}>Export</Text>
                  </Center>
                </Box>
              </Flex>
              <Box mt={-22}>
                <MRT_ToggleGlobalFilterButton style={{ color: '#4E70EA' }} table={table} />
                <MRT_ToggleFiltersButton style={{ color: '#4E70EA' }} table={table} />
                <MRT_ShowHideColumnsButton style={{ color: '#4E70EA' }} table={table} />
                <MRT_FullScreenToggleButton style={{ color: '#4E70EA' }} table={table} />
              </Box>
            </Stack>
          )}
        />
      </ThemeProvider>
    </Box>
  );
}