import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileTypes, fetchProfileMappings } from '../../redux/profileTypesSlice';
import { Grid, Card, Image, Text, Switch } from '@mantine/core';
import ProfileTableDisplay from '../../components/ProfileTableDisplay';
import { Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { clearCurrentCustomer } from '../../redux/customerSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const profileTypes = useSelector((state) => state.profileTypesCustomerMapping.profileTypes);
  const status = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);
  const error = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);
  const profileMappings = useSelector((state) => state.profileTypesCustomerMapping.profileMappings);
  const profileMappingsStatus = useSelector((state) => state.profileTypesCustomerMapping.profileMappingsStatus);
  const [showTable, setShowTable] = useState(false);
  const [checkedStates, setCheckedStates] = useState({})

  const imageDict = {
    'technology': 'https://imgur.com/a/cweY8fX',
    'sports': 'https://imgur.com/a/9NKkaqR',
    'music': 'https://imgur.com/a/zlQUb16',
    'gadget': 'https://imgur.com/kQHQ4IS',
    'food': 'https://imgur.com/a/hxhCUq9',
    'fitness': 'https://imgur.com/eFsmreM',
    'travel': 'https://imgur.com/iUw4buI',
    'automobile': 'https://imgur.com/B4aIhl5'
  }

  useEffect(() => {
    dispatch(clearCurrentCustomer());
    dispatch(fetchProfileTypes());
  }, [dispatch]);

  const handleProfileTypeClick = (profileTypeId) => {
    dispatch(fetchProfileMappings(profileTypeId));
    setShowTable(true);
  };

  const handleSwitchChange = (profileTypeId, isChecked) => {
    setCheckedStates((prevStates) => ({
      ...prevStates,
      [profileTypeId]: isChecked,
    }));
  };

  const handleTableRender = () => {
    if (profileMappingsStatus === 'loading') {
      return <>Loading ...</>;
    } else if (profileMappingsStatus === 'failed') {
      return <>Something went wrong</>;
    } else if (profileMappingsStatus === 'succeeded') {
      return <ProfileTableDisplay customerList={profileMappings} />;
    }
  };

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
        {!showTable ? (
          profileTypes.map((profileType) => (
            <Grid.Col span={3} key={profileType.id}>
              <Card shadow="sm" padding="lg" component="a" target="_blank">
                <Card.Section>
                  {console.log(imageDict[profileType.name])}
                  <Image
                    src={imageDict[profileType.name]}
                    style={{ width: '200px', height: '200px' }}
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
                    checked={checkedStates[profileType.id] || false}
                    onChange={(event) => handleSwitchChange(profileType.id, event.currentTarget.checked)}
                    style={{ display: 'inline-block', float: 'right' }}
                  />
                </Card.Section>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <>
            <Button onClick={() => setShowTable(false)} variant="text">
              <IconArrowBack /> Back
            </Button>
            <br />
            {handleTableRender()}
          </>
        )}
      </Grid>
    </div>
  );
};

export default Profile;
