import { ActionIcon, Badge, Button, Menu, MultiSelect, MultiSelectValueProps, Select, Text, rem, useMantineTheme } from '@mantine/core';
import {
    IconSquareCheck,
    IconPackage,
    IconUsers,
    IconCalendar,
    IconChevronDown,
    IconSearch,
    IconPlus,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import keywordOptions from '../KeywordsEntry/keywordOptions';
import { IconX } from '@tabler/icons-react';
import { useAuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

export default function AddMore({ title, tags, setTags, badgeClicked, selectedCustomer, setSelectedCustomer }: any) {
    const { token } = useAuthContext()
    console.log('tags in', tags)
    console.log('Selected Customer in add more', selectedCustomer)
    console.log('title in add more', title)
    const theme = useMantineTheme();
    const [keywordList, setKeywordList] = useState([
        ...keywordOptions.filter((key: any) =>
            key.label?.split('[')[1] == `${title}]`
        ),
        ...selectedCustomer.profiling?.garbage
    ])
    const [keywordsSelected, setKeywordsSelected]: any = useState([])

    const updateCustomer = async () => {
        // selectedCustomer.keys = keywordsSelected
        // useEffect(() => {
        //     setSelectedCustomer()((cust: any) => { return { ...cust, keys: keywordsSelected } })
        // }, [])
        const createPayload = () => {
            const payload = {
                ...selectedCustomer
            }
            return payload
        }

        const url = `${import.meta.env.VITE_API_BASE_URL}customers/${selectedCustomer.id}`
        const payload = createPayload()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        console.log('token used during submission:', token)
        console.log('keywords selected', keywordsSelected)
        console.log('payload', payload)
        console.log('config', config)
        await axios.patch(url, payload, config)
            .then(console.log)
            .catch(console.log)

        const customerUrl = `${import.meta.env.VITE_API_BASE_URL}customers/${selectedCustomer.id}`
        const { data } = await axios.get(url, config)
        setSelectedCustomer(data.customer_details)
    }

    // Remove tags/keys on badge click
    useEffect(() => {
        //Remove from tags
        setTags((prevTags: string[]) => prevTags.filter((tag) => tag != badgeClicked))
        //Remove from keys and hit api
        setSelectedCustomer((prevSelectedCustomer: any) => {
            const newKeys = prevSelectedCustomer.keys.filter((key: string) => key != badgeClicked)
            prevSelectedCustomer.keys = newKeys
            return prevSelectedCustomer
        })
        console.log('selectedCustomer after removing', selectedCustomer)
        //hiting api
        updateCustomer()
    }, [badgeClicked])


    const handleChange = (change: any) => {
        console.log('Change in handleChange is', change)
        // Add to tags
        setTags((prevTags: string[]) => [...prevTags, change])
        // Add to selectedCustomer keys
        setSelectedCustomer((prevSelectedCustomer: any) => {
            prevSelectedCustomer.keys = [...prevSelectedCustomer.keys, change]
            console.log('prevSelectedCustomer in handlechange', prevSelectedCustomer)
            return prevSelectedCustomer
        })
        console.log('selectedCustomer after adding keys', selectedCustomer)
        // Submit to api
        updateCustomer()
        // setKeywordsSelected(change)
    }

    const SelectComponent = () => (
        <Select
            hoverOnSearchChange
            data={keywordList}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={handleChange}
            placeholder={"Search"}
            clearable
            filter={(value, item) => {
                if (!tags.includes(item.value) && item.label?.toLowerCase().startsWith(value.toLowerCase().trim())) {
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
                input: { backgroundColor: '#FFFFFF00', },
            }}
            transitionProps={{ duration: 150, transition: 'pop-top-left', timingFunction: 'ease' }}
        />
    )

    const removeButton = (
        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
            <IconChevronDown size={rem(10)} />
        </ActionIcon>
    );

    const addButton = (
        <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
            <IconPlus size={rem(10)} />
        </ActionIcon>
    );

    return (
        <Menu
            transitionProps={{ transition: 'pop-bottom-right' }}
            position="bottom-start"
            width={220}
            withinPortal
        >
            <Menu.Target>
                <Badge
                    size="sm"
                    variant="outline"
                    rightSection={removeButton}
                    leftSection={addButton}
                    bg={'white'}>
                    <Text>Add More</Text>
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                {/* MultiSelect component */}
                <SelectComponent />
            </Menu.Dropdown>
        </Menu>
    );
}