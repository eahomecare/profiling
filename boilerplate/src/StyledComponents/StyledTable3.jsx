import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPaginatedResults,
  performGlobalSearch,
  selectCustomers,
  isLoading,
  resetSearch,
  selectTotal,
} from "../redux/elasticCustomersSlice";
import {
  clearCurrentCustomer,
  getCustomerDetails,
  setCurrentCustomerProfileCompletion,
} from "../redux/customerSlice";
import { MaterialReactTable } from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ThemeProvider, createTheme } from "@mui/material";
import { IconTableExport } from "@tabler/icons-react";
import {
  Box,
  Flex,
  ActionIcon,
  Text,
  useMantineTheme,
  Center,
} from "@mantine/core";

const StyledTable3 = () => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customers = useSelector(selectCustomers);
  const loading = useSelector(isLoading);
  const total = useSelector(selectTotal);

  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { pageIndex, pageSize } = pagination;
      const from = pageIndex * pageSize;

      if (searchTerm) {
        dispatch(performGlobalSearch({ searchTerm, from, size: pageSize }));
      } else {
        dispatch(fetchPaginatedResults({ from, size: pageSize }));
      }
    };

    fetchData();
  }, [dispatch, pagination, searchTerm]);

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
      { accessorKey: "email", header: "Email", minSize: 300 },
      { accessorKey: "source", header: "Source" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "profile_percentage", header: "Profile Completion (%)" },
    ],
    [],
  );

  const handleRowClick = useCallback(
    async (row) => {
      await dispatch(getCustomerDetails(row.original.customerId)).unwrap();
      dispatch(
        setCurrentCustomerProfileCompletion(row.original.profile_percentage),
      );
      navigate("/dashboard");
    },
    [dispatch, navigate],
  );

  const localTheme = createTheme({
    palette: {
      mode: theme.colorScheme === "dark" ? "dark" : "light",
    },
  });

  const handleExportRows = useCallback((rows) => {
    const csv = generateCsv(
      mkConfig({
        filename: "exported_customers",
        useKeysAsHeaders: true,
      }),
    )(rows.map((row) => row.original));
    download(csv);
  }, []);

  return (
    <ThemeProvider theme={localTheme}>
      <MaterialReactTable
        columns={columns}
        data={customers}
        loading={loading}
        enablePagination
        manualPagination
        rowCount={total}
        state={{
          pagination: {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            pageCount: Math.ceil(total / pagination.pageSize),
          },
          globalFilter: searchTerm,
        }}
        onGlobalFilterChange={setSearchTerm}
        onPaginationChange={setPagination}
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
          onClick: () => handleRowClick(row),
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
            </Flex>
          </Box>
        )}
      />
    </ThemeProvider>
  );
};

export default StyledTable3;
