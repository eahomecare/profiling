import {
  Avatar,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  RingProgress,
  Space,
  Text,
} from "@mantine/core";
import React, { useEffect, useState, useMemo } from "react";
import InfoTag from "./InfoTag";
import { fakerEN_IN as faker } from "@faker-js/faker";
import { useSelector } from "react-redux";

const PersonalInformation = ({ selectedCustomer }) => {
  const [profile, setProfile] = useState({
    ...selectedCustomer.profiling.personal_details,
  });
  const { customerDetails } = useSelector((state) => state.customer);
  console.log("state", customerDetails);
  const { profile_completion } = selectedCustomer;
  const { source } = selectedCustomer;
  const memoizedSelectedCustomer = useMemo(
    () => selectedCustomer,
    [selectedCustomer.id, selectedCustomer.profiling.personal_details],
  );

  const randomDetails = useMemo(() => {
    return {
      randomLocation: faker.location.city(),
      randomState: faker.location.state(),
      randomAddress: faker.location.streetAddress(),
      randomPincode: faker.location.zipCode(),
    };
  }, [memoizedSelectedCustomer]);

  if (profile) {
    return (
      <>
        <Container>
          <div>
            <Text fw={500}>Address & Other Info</Text>
            <Grid gutter="xl">
              <Grid.Col span={6}>
                <InfoTag
                  title={"Location(city)"}
                  subject={randomDetails.randomLocation}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag title={"State"} subject={randomDetails.randomState} />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag
                  title={"PINCODE"}
                  subject={randomDetails.randomPincode}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag title={"Country"} subject="India" />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag
                  title={"Address Line"}
                  subject={randomDetails.randomAddress}
                />
              </Grid.Col>
            </Grid>
          </div>
          <div>
            <Grid gutter="xl">
              <Grid.Col span={6}>
                <InfoTag
                  title={"Marital status"}
                  subject={profile.marital_status}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag
                  title={"Travel Address"}
                  subject={profile.travel_address}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <InfoTag title={"Anniversary"} subject={profile.anniversary} />
              </Grid.Col>

              <Grid.Col span={6}>
                <InfoTag title={"Employment"} subject={profile.employment} />
              </Grid.Col>
            </Grid>
          </div>
        </Container>
      </>
    );
  } else {
    return <>Fetching profile ...</>;
  }
};

export default PersonalInformation;
