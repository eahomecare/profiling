import { MultiSelect, Button } from "@mantine/core";
import React, { useState, useEffect, useMemo } from "react";
import AddKeywordsModal from "./AddKeywordsModal";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerKeywords ,getKeywords} from "../../redux/keywordSlice";
import _ from "lodash";

const KeywordsEntry = ({ props }) => {
  const [data, setData] = useState([]);

  const { status, customerDetails } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const { customerKeywords,keywords } = useSelector((state) => state.keyword);


  const [values, setValue] = useState();
  const [searchValue, onSearchChange] = useState("");

  // const keywordFinalPaylaod = []

  // const filteredKeywords = _.filter(values, (keyword) => _.includes(idsToFind, keyword.id));
  // const existingIds = _.map(filteredKeywords, 'id');
  // const notFoundIds = _.difference(idsToFind, foundIds);

  const transformedData = useMemo(
    () =>
      _.map(customerKeywords, ({ id,value,category }) => ({
        value: id,
        label: `${value} [${category}]`,
      })),
    [customerKeywords]
  );

  const allKeywords = useMemo(
    () =>
      _.map(keywords, ({ id,value,category }) => ({
        value: id,
        label: `${value} [${category}]`,
      })),
    [keywords]
  );

  useEffect(() => {
    setData(allKeywords);
    setValue(transformedData.map((obj) => obj.value));
  }, []);

  useEffect(() => {
    // setData(allKeywords);
    // setValue(transformedData.map((obj) => obj.value));
    console.log(values);
  }, [ data,values]);


  useEffect(() => {
    dispatch(getCustomerKeywords(customerDetails.id));
    dispatch(getKeywords())
  }, []);

  const handleSearchChange = useMemo(
    () =>
      _.debounce((value) => {
        onSearchChange(value);

      }, 200),
    []
  );

  return (
    <>
      <MultiSelect
        data={data}
        value={values}
        onChange={(e) => setValue(e)}
        label="Keywords"
        searchable
        searchValue={searchValue}
        onSearchChange={(event) => handleSearchChange(event)}
        clearable
        
        placeholder="Add keywords"
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setData((current) => [...current, item]);
          return item;
        }}
      />
    </>
  );
};

export default KeywordsEntry;
