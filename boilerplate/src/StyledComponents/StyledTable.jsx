/* eslint-disable react/jsx-pascal-case */
import {
  MaterialReactTable,
  MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ThemeProvider, createTheme } from "@mui/material";
import { IconTableExport } from "@tabler/icons-react";
import {
  Box,
  Center,
  Group,
  ActionIcon,
  Text,
  Flex,
  useMantineTheme,
} from "@mantine/core";

const StyledTable = ({ columns, data, onRowClick, topProps, ...restProps }) => {
  const theme = useMantineTheme();

  const localTheme = createTheme({
    shadows: Array(25)
      .fill("none")
      .map((_, i) =>
        i === 2
          ? "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
          : "none",
      ),
    spacing: (factor) => `${0.25 * factor}rem`,
    palette: {
      background: {
        default: "#00000000",
        // theme.colorScheme == "light" ? "#F1F5F9" : "#25262B",
      },
      text: {
        primary: theme.colorScheme == "light" ? "#0E0E0F" : "#A6A7AB",
      },
    },
  });

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "exported_customers",
  });

  const handleExportRows = (rows) => {
    const csv = generateCsv(csvConfig)(rows.map((row) => row.original));
    download(csvConfig)(csv);
  };

  return (
    <ThemeProvider theme={localTheme}>
      <MaterialReactTable
        columns={columns}
        data={data}
        defaultColumn={{ maxSize: 300 }}
        enableColumnActions={false}
        enableDensityToggle={false}
        state={{ density: "compact" }}
        initialState={{ density: "compact" }}
        muiTableProps={{
          sx: { tableLayout: "fixed" },
        }}
        muiTablePaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: theme.colorScheme === "dark" ? "#25262B" : "white",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => onRowClick(row.original),
          sx: {
            cursor: "pointer",
            transition: "transform 0.3s ease, background-color 0.3s ease",
            "&:hover": {
              transform: "scale(0.99)",
              backgroundColor: "#F3F6FF90",
            },
          },
        })}
        muiTableBodyCellProps={{
          sx: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
        muiTableHeadRowProps={{
          sx: { backgroundColor: "#F3F6FF" },
        }}
        muiTablePaginationProps={{
          sx: { color: "#2B1DFD" },
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box w={"100%"} pt={10}>
            <Flex justify={"space-between"}>
              <Center>
                <ActionIcon
                  c={"#2B1DFD"}
                  size={"sm"}
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                >
                  <IconTableExport />
                </ActionIcon>
                <Text fw={"bold"} c={"#2B1DFD"} size={"sm"}>
                  Export
                </Text>
              </Center>
              <Center>
                <Group>{topProps ? topProps() : null}</Group>
              </Center>
            </Flex>
          </Box>
        )}
        renderToolbarInternalActions={({ table }) => (
          <Box w={160}>
            <MRT_ToggleGlobalFilterButton
              style={{ color: "#2B1DFD" }}
              table={table}
            />
            <MRT_ToggleFiltersButton
              style={{ color: "#2B1DFD" }}
              table={table}
            />
            <MRT_ShowHideColumnsButton
              style={{ color: "#2B1DFD" }}
              table={table}
            />
            <MRT_FullScreenToggleButton
              style={{ color: "#2B1DFD" }}
              table={table}
            />
          </Box>
        )}
        {...restProps}
      />
    </ThemeProvider>
  );
};

export default StyledTable;
