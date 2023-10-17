import { MultiSelect, Button, Badge } from "@mantine/core";
import React, { useState, useEffect, useMemo } from "react";
import AddKeywordsModal from "./AddKeywordsModal";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerKeywords, getKeywords } from "../../redux/keywordSlice";
import _ from "lodash";


function hasPermission(userPermissions, permissionName) {
  return userPermissions.some(
    (permission) => permission.name === permissionName,
  );
}

const KeywordsEntry = ({ updateKeywordValuesParent }) => {
  const [data, setData] = useState([]);



  const { status, customerDetails } = useSelector((state) => state.customer);
  const { userPermissions, rolesPermissionsStatus } =
    useSelector((state) => state.rolePermission);
  const dispatch = useDispatch();

  const { customerKeywords, keywords, keywordsStatus, customerKeywordsStatus } = useSelector((state) => state.keyword);


  const [values, setValue] = useState();
  const [searchValue, onSearchChange] = useState("");
  const [unknowns, setUnknowns] = useState([])



  // const keywordFinalPaylaod = []

  // const filteredKeywords = _.filter(values, (keyword) => _.includes(idsToFind, keyword.id));
  // const existingIds = _.map(filteredKeywords, 'id');
  // const notFoundIds = _.difference(idsToFind, foundIds);

  const transformedData = useMemo(
    () =>
      _.map(customerKeywords, ({ id, value, category }) => ({
        value: id,
        label: `${value} [${category}]`,
      })),
    [customerKeywords]
  );

  const allKeywords = useMemo(
    () =>
      _.map(keywords, ({ id, value, category }) => ({
        value: id,
        label: `${value} [${category}]`,
      })),
    [keywords]
  );



  const unknownValues = _.map(
    _.filter(keywords, { category: 'unknown' }),
    'value'
  );


  useEffect(() => {
    if (keywordsStatus == 'success' && customerKeywordsStatus == 'success') {
      setData(allKeywords);
      setValue(transformedData.map((obj) => obj.value));
      setUnknowns(unknownValues)

    }


  }, [customerKeywords, keywords]);

  useEffect(() => {
    // setData(allKeywords);
    // setValue(transformedData.map((obj) => obj.value));
    updateKeywordValuesParent(values)
  }, [data, values]);


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
      {console.log(userPermissions, hasPermission(userPermissions, "keywords_edit"))}
      {keywordsStatus == 'success' && customerKeywordsStatus == 'success' && userPermissions && Array.isArray(userPermissions) ?
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
            withinPortal
            placeholder="Add keywords"
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setData((current) => [...current, item]);
              return item;
            }}
            readOnly={!hasPermission(userPermissions, "keywords_edit")}
          />

          <div style={{ marginTop: '1rem' }}>
            Existing Unknown keywords : {unknowns.map((unknown, index) => (
              <Badge
                key={unknown}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
              >
                {unknown}
              </Badge>
            ))}
          </div>
        </>
        : <>
          <p>Please wait.......</p>
        </>
      }

    </>
  );
};

export default KeywordsEntry;
