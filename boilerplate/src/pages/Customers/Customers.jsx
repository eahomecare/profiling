import { LoadingOverlay, Title } from "@mantine/core";
import { useEffect } from "react";
import {
  getCustomers,
  getCustomersProfileCompleteness,
} from "../../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import TableDisplay from "../../components/TableDisplay";

const Customers = () => {
  const dispatch = useDispatch();

  const { status, customers, fetchedPofileCompleteness } = useSelector(
    (state) => state.customer,
  );

  // if(Array.isArray(customers) && customers.length > 0) setCustomerList(customers)

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getCustomersProfileCompleteness());
  }, []);

  if (status === "loading") {
    return (
      <LoadingOverlay
        visible
        overlayBlur={2}
        overlayColor={"#F3F6FF"}
        loaderProps={{
          color: "#5C0FF2",
          size: "xl",
          variant: "dots",
        }}
      />
    );
  } else {
    return (
      <>
        <div style={{ display: "flex" }}>
          <span style={{ flexGrow: "1", width: "100px" }}>
            <div style={{ padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  marginTop: "5px",
                }}
              >
                <span>
                  <Title pl={5}>Customers</Title>
                </span>
              </div>
              <TableDisplay
                customerList={customers}
                fetchedPofileCompleteness={fetchedPofileCompleteness}
              />
            </div>
          </span>
        </div>
      </>
    );
  }
};

export default Customers;
