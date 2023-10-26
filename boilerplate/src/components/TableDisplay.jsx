import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCustomer } from "../redux/customerSlice";

import { RingProgress, Text, Box, Loader } from "@mantine/core";
import StyledTable from "../StyledComponents/StyledTable";

export default function TableDisplay({
  customerList,
  fetchedPofileCompleteness,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileCompletion = (percentage) => {
    return (
      <Box>
        <RingProgress
          size={45}
          thickness={3}
          sections={[
            {
              value: percentage,
              color:
                percentage > 25
                  ? "#1D9B25"
                  : percentage > 50
                  ? "#CFA400"
                  : "#D85972",
            },
          ]}
          label={
            <Text color="" weight={20} align="center" size="xs">
              {percentage}%
            </Text>
          }
        />
      </Box>
    );
  };

  const handleRowClick = (customer) => {
    navigate("/dashboard");
    dispatch(setCurrentCustomer(customer));
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.profiling?.personal_details?.full_name}`,
        id: "name",
        header: "Name",
      },
      {
        accessorFn: (row) => `CLID${row.id.substr(0, 6)}....`,
        id: "customerId",
        header: "Customer Id",
      },
      {
        accessorKey: "email",
        header: "Email",
        minSize: 400,
      },
      {
        accessorKey: "source",
        header: "Source",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorFn: (row) =>
          !fetchedPofileCompleteness ? (
            <Loader type={"dots"} color="#2B1DFD" />
          ) : (
            profileCompletion(row.profile_completion)
          ),
        id: "profileCompletion",
        header: "Profile Completion",
      },
    ],
    [fetchedPofileCompleteness],
  );

  return (
    <Box>
      <StyledTable
        columns={columns}
        data={customerList}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
