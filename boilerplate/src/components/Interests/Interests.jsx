import { Badge } from '@mantine/core';
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getCustomerKeywords } from '../../redux/keywordSlice';
import { Text } from '@mantine/core';






const Interests = () => {
  const dispatch = useDispatch()
  const { status, customerDetails } = useSelector((state) => state.customer);
  const { customerKeywords, customerKeywordsStatus } = useSelector((state) => state.keyword);
  const [interests, setInterests] = useState([])



  const transformedData = useMemo(() => {
    const groupedByCategory = _.groupBy(customerKeywords, 'category');
    return _.map(groupedByCategory, (values, category) => {
      // Use _.uniq to remove duplicate values
      const uniqueValues = _.uniq(_.map(values, 'value'));
      return { category, values: uniqueValues };
    });
  }, [customerKeywords]);

  useEffect(() => {
    status && dispatch(getCustomerKeywords(customerDetails.id));
  }, []);

  useEffect(() => {
    if (customerKeywordsStatus == 'success') {
      setInterests(transformedData);
    }
  }, [customerKeywords]);


  return (
    <>
      {customerKeywordsStatus == 'success' ?
        <>
          {interests.map((interest) => (
            <React.Fragment key={interest.category}>
              <Text fw={700}>{interest.category}</Text>
              {interest.values.map((value) => (
                <Badge
                  key={value}
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                >
                  {value}
                </Badge>
              ))}
            </React.Fragment>
          ))}
        </> :
        <>Loading interests...</>
      }


    </>

  )
}

export default Interests