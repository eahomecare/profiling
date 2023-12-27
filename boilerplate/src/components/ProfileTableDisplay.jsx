import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCustomerDetails } from "../redux/customerSlice";
import { useSelector } from "react-redux";

import { RingProgress, Text, Box, Loader } from "@mantine/core";
import StyledTable from "../StyledComponents/StyledTable";


export default function ProfileTableDisplay({ customerList }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerDetailsStatus = useSelector(state => state.customer.customerDetailsStatus)



  const handleRowClick = (customer) => {
    dispatch(getCustomerDetails(customer.customerId));
  };

  useEffect(() => {
    if (customerDetailsStatus === "success") {
      navigate("/dashboard");
    }

    console.log(customerDetailsStatus);
  }, [customerDetailsStatus, navigate]);

  const columns = [
    {
      accessorKey: "customerName",
      header: "Name",
      minSize: 400,
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
      accessorKey: "level",
      header: "Level",
    }
  ];




  return (
    <Box style={{ marginTop: "30px" }}>
      <StyledTable columns={columns} data={customerList} onRowClick={handleRowClick} />
    </Box>
  );
}
