import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPaginatedResults,
  performGlobalSearch,
  performCompoundSearch,
  selectCustomers,
  isLoading,
  selectPagination,
  resetSearch,
} from "../redux/elasticCustomersSlice";
import { clearCurrentCustomer } from "../redux/customerSlice";
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
  Flex,
  ActionIcon,
  Text,
  useMantineTheme,
  Group,
  Center,
} from "@mantine/core";
import {
  getCustomerDetails,
  setCurrentCustomerProfileCompletion,
} from "../redux/customerSlice";

const StyledTable3 = () => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customers = useSelector(selectCustomers);
  const loading = useSelector(isLoading);
  const pagination = useSelector(selectPagination);
  const { from, size } = pagination;

  const [searchTerm, setSearchTerm] = useState("");
  const [columnSearch, setColumnSearch] = useState({});

  const customerDetailsStatus = useSelector(
    (state) => state.customer.customerDetailsStatus,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        // Perform global search if there's a searchTerm
        dispatch(performGlobalSearch({ searchTerm, from: 0, size }));
      } else {
        // Fetch paginated results if there's no searchTerm
        dispatch(fetchPaginatedResults({ from, size }));
      }
    };

    fetchData();
  }, [dispatch, from, size, searchTerm]);

  useEffect(() => {
    return () => {
      dispatch(resetSearch());
    };
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorFn: (row) => `CLID${row.customerId.slice(0, 6)}...`,
        id: "customerId",
        header: "Customer ID",
      },
      {
        accessorKey: "email",
        header: "Email",
        minSize: 300,
      },
      { accessorKey: "source", header: "Source" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "profile_percentage", header: "Profile Completion (%)" },
    ],
    [],
  );

  const fetchData = useCallback(
    ({ pageIndex, pageSize, globalFilter, filters = {} }) => {
      const calculatedFrom = isNaN(pageIndex * pageSize)
        ? 0
        : pageIndex * pageSize;
      if (globalFilter) {
        dispatch(
          performGlobalSearch({
            searchTerm: globalFilter,
            from: calculatedFrom,
            size: pageSize,
          }),
        );
      } else if (Object.keys(filters).length) {
        dispatch(
          performCompoundSearch({
            searchTerms: filters,
            from: calculatedFrom,
            size: pageSize,
          }),
        );
      } else {
        dispatch(
          fetchPaginatedResults({ from: calculatedFrom, size: pageSize }),
        );
      }
    },
    [dispatch],
  );

  const handleExportRows = useCallback((rows) => {
    const csv = generateCsv(
      mkConfig({
        filename: "exported_customers",
        useKeysAsHeaders: true,
      }),
    )(rows.map((row) => row.original));
    download(csv);
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      console.log(row); // Adjust based on what data you need from the clicked row
      dispatch(getCustomerDetails(row.customerId));
      dispatch(setCurrentCustomerProfileCompletion(row.profile_percentage)); // Adjust based on actual data structure
    },
    [dispatch],
  );

  // Use useEffect to listen for changes to customerDetailsStatus
  useEffect(() => {
    if (customerDetailsStatus === "success") {
      // Navigate to the dashboard (or wherever you need) once details are successfully fetched
      dispatch(clearCurrentCustomer());
      navigate("/dashboard");
    }
  }, [customerDetailsStatus, navigate]);

  const localTheme = createTheme({
    palette: {
      mode: theme.colorScheme === "dark" ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={localTheme}>
      <MaterialReactTable
        columns={columns}
        data={customers}
        loading={loading}
        onRowClick={({ row }) => console.log(row)}
        defaultColumn={{ maxSize: 300 }}
        enableColumnActions={false}
        enableDensityToggle={false}
        enablePagination
        manualPagination
        rowCount={size}
        state={{
          density: "compact",
          globalFilter: searchTerm,
          pagination: {
            pageIndex: from / size,
            pageSize: size,
          },
        }}
        onGlobalFilterChange={(value) => setSearchTerm(value)}
        onPaginationChange={(state) => fetchData({ ...state })}
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
          onClick: () => handleRowClick(row.original),
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
          sx: { color: "#0d5ff9" },
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box w={"100%"} pt={10}>
            <Flex justify={"space-between"}>
              <Center>
                <ActionIcon
                  color={"#0d5ff9"}
                  size={"sm"}
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                >
                  <IconTableExport />
                </ActionIcon>
                <Text fontWeight={"bold"} color={"#0d5ff9"} size={"sm"}>
                  Export
                </Text>
              </Center>
              <Center>
                <Group>{/* Add any top props if needed */}</Group>
              </Center>
            </Flex>
          </Box>
        )}
        renderToolbarInternalActions={({ table }) => (
          <Box w={160}>
            <MRT_ToggleGlobalFilterButton
              style={{ color: "#0d5ff9" }}
              table={table}
            />
            <MRT_ToggleFiltersButton
              style={{ color: "#0d5ff9" }}
              table={table}
            />
            <MRT_ShowHideColumnsButton
              style={{ color: "#0d5ff9" }}
              table={table}
            />
            <MRT_FullScreenToggleButton
              style={{ color: "#0d5ff9" }}
              table={table}
            />
          </Box>
        )}
      />
    </ThemeProvider>
  );
};

export default StyledTable3;
