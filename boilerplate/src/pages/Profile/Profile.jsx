import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileTypes, fetchProfileMappings } from '../../redux/profileTypesSlice';
import { Grid, Card, Image, Text, Switch } from '@mantine/core';
import ProfileTableDisplay from '../../components/ProfileTableDisplay';
import { Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { clearCurrentCustomer } from '../../redux/customerSlice';

const Profile = () => {
  const [checked, setChecked] = React.useState(false);

  const dispatch = useDispatch();
  const profileTypes = useSelector((state) => state.profileTypesCustomerMapping.profileTypes);
  const status = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);
  const error = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);
  const profileMappings = useSelector((state) => state.profileTypesCustomerMapping.profileMappings);
  const profileMappingsStatus = useSelector((state) => state.profileTypesCustomerMapping.profileMappingsStatus);
  const [showTable, setShowTable] = useState(false)
  console.log(profileMappingsStatus);


  useEffect(() => {
    dispatch(clearCurrentCustomer())
    dispatch(fetchProfileTypes());

  }, [dispatch]);

  const handleProfileTypeClick = (profileTypeId) => {
    // Call fetchProfileMappings with the profileTypeId
    dispatch(fetchProfileMappings(profileTypeId));
    setShowTable(true)
  };

  const handleTableRender = () => {
    if (profileMappingsStatus == 'loading') {
      return <>Loading ...</>
    } else if (profileMappingsStatus == 'failed') {
      return <>Something went wrong</>
    } else if (profileMappingsStatus == 'succeeded') {
      return <>
        {console.log("ok")}
        <ProfileTableDisplay customerList={profileMappings} />

      </>
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Profile Types</h1>
      <Grid>
        {!showTable ? profileTypes.map((profileType) => (
          <Grid.Col span={3} key={profileType.id}>
            <Card shadow="sm" padding="lg" component="a" target="_blank">
              <Card.Section>
                <Image
                  src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg"
                />
              </Card.Section>

              <Card.Section style={{ padding: '10px' }}>
                <Text
                  fw={500}
                  size="lg"
                  style={{ display: 'inline-block', marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => handleProfileTypeClick(profileType.id)}
                >
                  {profileType.name}
                </Text>

                <Switch
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                  style={{ display: 'inline-block', float: 'right' }}
                />
              </Card.Section>
            </Card>
          </Grid.Col>
        )) : <><Button onClick={() => setShowTable(false)}><IconArrowBack /> Back </Button> <br /> {handleTableRender()}</>}
      </Grid>
    </div>
  );
};

export default Profile;
