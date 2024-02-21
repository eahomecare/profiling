import {
  LoadingOverlay,
  Title,
  Button,
  ActionIcon,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import { useEffect } from "react";
import {
  getCustomers,
  getCustomersProfileCompleteness,
  clearCurrentCustomer,
} from "../../redux/customerSlice";
import { loadingStateElasticCustomers } from "../../redux/elasticCustomersSlice.js";
import { useDispatch, useSelector } from "react-redux";
import TableDisplay from "../../components/TableDisplay";
import { IconRefresh } from "@tabler/icons-react";
import TableDisplay2 from "../../components/TableDisplay2";
import StyledTable3 from "../../StyledComponents/StyledTable3";
import { fetchPaginatedResults } from "../../redux/elasticCustomersSlice";

const Customers = () => {
  const dispatch = useDispatch();
  // const { status, customers, fetchedPofileCompleteness } = useSelector(
  //   (state) => state.customer,
  // );
  //
  useEffect(() => {
    dispatch(clearCurrentCustomer());
  }, []);
  // //
  // useEffect(() => {
  //   dispatch(getCustomers());
  //   dispatch(getCustomersProfileCompleteness());
  // }, [dispatch]);
  //
  // const handleRefresh = () => {
  //   dispatch(getCustomers());
  //   dispatch(getCustomersProfileCompleteness());
  // };

  // const refreshButton = (
  //   <ActionIcon c={"#0d5ff9"} size={"sm"} onClick={handleRefresh}>
  //     <IconRefresh />
  //   </ActionIcon>
  // );

  // if () {
  //   return (
  //     <Center>
  //       <Loader c="#0d5ff9" size="lg" />
  //     </Center>
  //     // <LoadingOverlay
  //     //   visible
  //     //   overlayBlur={2}
  //     //   overlayColor={"#F3F6FF"}
  //     //   loaderProps={{
  //     //     color: "#0d5ff9",
  //     //     size: "xl",
  //     //     variant: "dots",
  //     //   }}
  //     // />
  //   );
  // } else {
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
            {/* <TableDisplay */}
            {/*   customerList={customers} */}
            {/*   fetchedPofileCompleteness={fetchedPofileCompleteness} */}
            {/*   topProps={() => refreshButton} */}
            {/* /> */}
            {/* <TableDisplay2 /> */}
            <StyledTable3 />
          </div>
        </span>
      </div>
    </>
  );
};
//};

export default Customers;
