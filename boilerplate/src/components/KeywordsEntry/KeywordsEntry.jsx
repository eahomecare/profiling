import { MultiSelect } from '@mantine/core';
import React,{useState} from 'react'





const KeywordsEntry = props => {
    const [data, setData] = useState([
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' },
      ]);

    const [values,setValue] = useState(["react"])
    

    function print(e){
        console.log(e);
    }


    
  return (
    <MultiSelect
        data={data}
        value={values}
        onChange={(e) => setValue(e)}
        defaultValue={{ value: 'react', label: 'React' }}
        label="Keywords"
        clearable
        placeholder="Pick all that you like"
  />
  )
}


export default KeywordsEntry