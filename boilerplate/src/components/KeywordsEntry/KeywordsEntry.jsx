import { MultiSelect, Button } from "@mantine/core";
import React, { useState, useEffect,useMemo } from "react";
import AddKeywordsModal from "./AddKeywordsModal";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerKeywords } from "../../redux/keywordSlice";
import _ from "lodash";

const KeywordsEntry = ({ props }) => {
  const [data, setData] = useState([]);

  const { status, customerDetails } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const { customerKeywords } = useSelector((state) => state.keyword);

  const [values, setValue] = useState();
  const [searchValue, onSearchChange] = useState("");

  const transformedData = useMemo(
    () =>
      _.map(customerKeywords, ({ value }) => ({
        value: value,
        label: value,
      })),
    [customerKeywords]
  );


  useEffect(() => {

    setData(transformedData);
    setValue(transformedData.map((obj) => obj.value));

    console.log(values);
  }, [customerDetails, dispatch,data]);

  useEffect(() => {
    dispatch(getCustomerKeywords(customerDetails.id));
  }, []);


  useEffect(() => {
    
  },[])

  return (
    <>
      <MultiSelect
        data={data}
        value={values}
        onChange={(e) => setValue(e)}
        defaultValue={{ value: "react", label: "React" }}
        label="Keywords"
        searchable
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        clearable
        placeholder="Pick all that you like"
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
