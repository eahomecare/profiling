import { useEffect, useState } from 'react';
import { ActionIcon, Badge, Flex, MultiSelect, MultiSelectValueProps, rem, TextInput } from '@mantine/core';
import keywordOptions from './keywordOptions'
import Submit from './Submit';
import { IconX } from '@tabler/icons-react';

export default function KeywordsEntry({ selectedCustomer, setSelectedCustomer }: any) {
    console.log('keywordsEntry', selectedCustomer)
    const [keywordList, setKeywordList] = useState([...keywordOptions, ...selectedCustomer.profiling?.garbage])
    // const [keywordList, setKeywordList] = useState([...keywordOptions, ...selectedCustomer.keys])
    const [keywordsSelected, setKeywordsSelected]: any = useState(selectedCustomer.keys)
    console.log('keywords selected in keywords entry', keywordsSelected)
    // useEffect(() => {
    //     setTimeout(() => setKeywordList(keywordOptions), 1000)
    // }, [])

    const handleChange = (change: any) => {
        setKeywordsSelected(change)
    }


    const value = ({ label, onRemove, ...others }: MultiSelectValueProps) => {
        const removeButton = (
            <ActionIcon onMouseDown={onRemove} size="xs" color="blue" radius="xl" variant="transparent">
                <IconX size={rem(10)} />
            </ActionIcon>
        );
        return <div {...others}>
            <Badge key={label} size="sm" variant="outline" rightSection={removeButton}>
                {label}
            </Badge>
        </div>
    }

    const MultiSelectComponent = () => (
        <MultiSelect
            label={`Keywords (${keywordsSelected.length})`}
            // maxDropdownHeight={150}
            value={keywordsSelected}
            data={keywordList}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={handleChange}
            placeholder={"Enter customer's keywords"}
            clearable
            filter={(value, selected, item) => {
                if (!selected && item.label?.toLowerCase().startsWith(value.toLowerCase().trim())) {
                    return true
                }
                else return false
            }
            }
            onCreate={(query) => {
                const item = { value: query, label: query };
                setKeywordList((current: any) => [...current, item]);
                return item;
            }}
            styles={{
                input: { minHeight: '200px', backgroundColor: '#FFFFFF00', },
            }}
            valueComponent={value}
            transitionProps={{ duration: 150, transition: 'pop-top-left', timingFunction: 'ease' }}
        />
    )

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                {/* <div>
                    <TextInput label={'Mobile'} required value={mobile} onChange={(e) => setMobile(e.target.value)}
                        icon={<IconPhone size="1rem" />}
                        placeholder={'Enter Mobile Number'}

                    />
                </div> */}
                <MultiSelectComponent />
                <Flex pt={4}>
                    <Submit keywordsSelected={keywordsSelected} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
                </Flex>
            </div>
        </>
    );
}