import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Badge, Flex, MultiSelect, MultiSelectValueProps, rem, Text, TextInput } from '@mantine/core';
import keywordOptions from '../KeywordsEntry/keywordOptions'
import { IconX } from '@tabler/icons-react';

export default function KeywordsEntry() {
    const [keywordList, setKeywordList] = useState<{ label: string, value: string }[]>(keywordOptions)
    const [keywordsSelected, setKeywordsSelected] = useState([]) // initialize it as an empty array

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
            hoverOnSearchChange
            variant='filled'
            radius={'md'}
            label={<Text fw={700}>{`Keywords (${keywordsSelected.length})`}</Text>}
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
                input: { minHeight: '7rem' },
            }}
            valueComponent={value}
            transitionProps={{ duration: 150, transition: 'pop-top-left', timingFunction: 'ease' }}
        />
    )

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <MultiSelectComponent />
            </div>
        </>
    );
}