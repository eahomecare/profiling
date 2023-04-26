import { MultiSelect, Button } from '@mantine/core';
import React, { useState,useEffect } from 'react';
import AddKeywordsModal from './AddKeywordsModal';
import { useDispatch, useSelector } from "react-redux";
import { getCustomerKeywords } from '../../redux/keywordSlice';
import _ from 'lodash'


const KeywordsEntry = ({props}) => {

  const [data, setData] = useState([]);


  const { status, customerDetails } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const { customerKeywords } = useSelector((state) => state.keyword);
 





  const [values, setValue] = useState();
  const [modalOpened, setModalOpened] = useState(false);
  const [searchValue, onSearchChange] = useState('');


  useEffect(() => {

    const transformedData = _.map(customerKeywords, ({ value }) => ({ value: value, label: value }));
    setData(transformedData)
    setValue(transformedData.map(obj => obj.value))

    console.log(values);

  
},[customerDetails,dispatch])


useEffect(() => {
  dispatch(getCustomerKeywords(customerDetails.id));
}, []);

  function handleModalOpen() {
    setModalOpened(true);
  }

  function handleModalClose() {
    setModalOpened(false);
  }

  return (
    <>
      <MultiSelect
        data={data}
        value={values}
        onChange={(e) => setValue(e)}
        defaultValue={{ value: 'react', label: 'React' }}
        label="Keywords"
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        clearable
        placeholder="Pick all that you like"
      />
      <Button onClick={handleModalOpen}>Add Keywords</Button>
      <AddKeywordsModal
        opened={modalOpened}
        onClose={handleModalClose}
      />
    </>
  );
};

export default KeywordsEntry;
