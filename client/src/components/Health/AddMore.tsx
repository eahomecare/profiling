import React, { useState } from 'react';
import {
    ActionIcon,
    Badge,
    Menu,
    Select,
    Text,
    rem,
    useMantineTheme,
} from '@mantine/core';
import {
    IconChevronDown,
    IconPlus,
} from '@tabler/icons-react';

interface AddMoreProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddMore: React.FC<AddMoreProps> = ({ tags, setTags }) => {
    const theme = useMantineTheme();
    const [keywordList, setKeywordList] = useState<string[]>([
        'Food',
        'Pet',
        'Mold',
        'Pollen',
        'Insect',
        'Egg',
        'Fruit',
        'Peanut',
        'Soy'
    ]);

    const handleChange = (value: string) => {
        setTags([...tags, value]);
    };

    const SelectComponent = () => (
        <Select
            hoverOnSearchChange
            data={keywordList}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={handleChange}
            placeholder="Search"
            clearable
            filter={(value, item) =>
                !tags.includes(item.value) &&
                (item.label?.toLowerCase().startsWith(value.toLowerCase().trim()) ?? false)
            }
            onCreate={(query) => {
                const item = { value: query, label: query };
                setKeywordList((current) => [...current, query]);
                return item;
            }}
            styles={{
                input: { backgroundColor: '#FFFFFF00' },
            }}
            transitionProps={{ duration: 150, transition: 'pop-top-left', timingFunction: 'ease' }}
        />
    );

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
                    bg={'white'}
                >
                    <Text>Add More</Text>
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                <SelectComponent />
            </Menu.Dropdown>
        </Menu>
    );
};

export default AddMore;