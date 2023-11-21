import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@mantine/core";
import { StatsCard } from "./StatCard";
import { fetchData } from "../../redux/profileTypesSlice";

const Profiling = () => {
  const dispatch = useDispatch();
  const profileData = useSelector(
    (state) => state.profileTypesCustomerMapping.data,
  );
  const { customerDetails } = useSelector((state) => state.customer);

  console.log("Profiling data", profileData);

  useEffect(() => {
    dispatch(fetchData(customerDetails.id));
  }, [dispatch, customerDetails]);

  const stats = profileData.map((profile) => (
    <Grid.Col key={profile.profileType.id} span={4}>
      <StatsCard
        title={profile.profileType.name}
        url={profile.profileType.srcUrl}
        percentage={Math.round(profile.profileCompletion)}
      />
    </Grid.Col>
  ));

  return (
    <>
      <Grid gutter="xl">{stats}</Grid>
    </>
  );
};

export default Profiling;

