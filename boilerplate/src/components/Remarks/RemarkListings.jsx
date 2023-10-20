import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button } from "@mantine/core";
import StyledTable from "../../StyledComponents/StyledTable";
import { getCustomerRemarks } from "../../redux/customerSlice"; // replace 'path_to_your' with the actual path

const RemarkListings = () => {
  const dispatch = useDispatch();
  const customerRemarks = useSelector(
    (state) => state.customer.customerRemarks,
  );
  const remarksStatus = useSelector((state) => state.customer.remarksStatus);
  const currentCustomerId = useSelector(
    (state) => state.customer.customerDetails.id,
  ); // Assuming 'id' is the field in customerDetails for the customer's ID

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRemark, setSelectedRemark] = useState(null);

  useEffect(() => {
    if (currentCustomerId) {
      dispatch(getCustomerRemarks(currentCustomerId));
    }
  }, [dispatch, currentCustomerId]);

  // Define columns for StyledTable
  const columns = useMemo(
    () => [
      {
        accessorKey: "agentName",
        header: "Agent Name",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "time",
        header: "Time",
      },
      {
        accessorKey: "remark",
        header: "Remark",
      },
    ],
    [],
  );

  const handleRowClick = (remark) => {
    setSelectedRemark(remark);
    open();
  };

  return (
    <>
      <Box>
        {remarksStatus === "success" ? (
          <StyledTable
            columns={columns}
            data={customerRemarks}
            onRowClick={handleRowClick}
          />
        ) : remarksStatus === "loading" ? (
          <p>Loading...</p>
        ) : (
          <p>Failed to load remarks.</p>
        )}
      </Box>

      <Modal opened={opened} onClose={close} title="Remark Details" centered>
        {selectedRemark && (
          <div>
            <p>
              <strong>Agent Name:</strong> {selectedRemark.agentName}
            </p>
            <p>
              <strong>Date:</strong> {selectedRemark.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedRemark.time}
            </p>
            <p>
              <strong>Remark:</strong> {selectedRemark.remark}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RemarkListings;
