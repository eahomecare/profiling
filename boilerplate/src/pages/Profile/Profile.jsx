import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileTypes } from '../../redux/profileTypesSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const profileTypes = useSelector((state) => state.profileTypesCustomerMapping.profileTypes);
  const status = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);
  const error = useSelector((state) => state.profileTypesCustomerMapping.profileTypesStatus);

  useEffect(() => {
    dispatch(fetchProfileTypes());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Profile Types</h1>
      <ul>
        {profileTypes.map((profileType) => (
          <li key={profileType.id}>{profileType.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
