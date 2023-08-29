import React from 'react';
import { ActionIcon, Select } from '@mantine/core';
import { IconChevronDown, IconTrash, IconX } from '@tabler/icons-react';

const DropdownRow = ({ row, rowId, handleDropdownChange, dropdownData, selectedCombinations, deleteRow }) => {

    const figures = row.figures
    const secondDropdownOptions = row.first ? Object.keys(dropdownData[row.first]) : [];

    const thirdDropdownOptions = row.second
        ? dropdownData[row.first][row.second].filter(option => {
            const currentCombination = {
                first: row.first,
                second: row.second,
                third: row.first === "Interests" ? option.value : option
            };

            // Check if the current combination is already selected
            const isSelectedCombination = selectedCombinations.some(selected =>
                selected.first === currentCombination.first &&
                selected.second === currentCombination.second &&
                (row.first === "Interests" ? selected.third.value : selected.third) === currentCombination.third
            );

            // Check if the current combination is selected in this row
            const isSelectedInCurrentRow = selectedCombinations.some(selected =>
                selected.rowId === rowId &&
                selected.first === currentCombination.first &&
                selected.second === currentCombination.second &&
                (row.first === "Interests" ? selected.third.value : selected.third) === currentCombination.third
            );

            return !isSelectedCombination || isSelectedInCurrentRow;
        })
        : [];

    return (
        <React.Fragment>
            <div className='col-12 col-lg-3'>
                <div className='mb-4 col-6 col-lg-12' >
                    <Select
                        data={Object.keys(dropdownData).map(option => ({
                            value: option,
                            label: typeof option === 'string' ? option : null
                        }))}
                        searchable
                        rightSection={<IconChevronDown size="1rem" />}
                        rightSectionWidth={30}
                        styles={{ rightSection: { pointerEvents: 'none' }, input: { cursor: 'pointer' } }}
                        value={row.first}
                        placeholder="Select Information Type"
                        onChange={(value) => handleDropdownChange(rowId, "first", value)}
                    />
                </div>
            </div>
            <div className='col-12 col-lg-3'>
                <div className='mb-4 col-6 col-lg-12'>
                    <Select
                        data={secondDropdownOptions.map(option => ({
                            value: option,
                            label: typeof option === 'string' ? option : null
                        }))}
                        searchable
                        rightSection={<IconChevronDown size="1rem" />}
                        rightSectionWidth={30}
                        styles={{ rightSection: { pointerEvents: 'none' }, input: { cursor: 'pointer' } }}
                        value={row.second}
                        placeholder="Select Category"
                        onChange={(value) => handleDropdownChange(rowId, "second", value)}
                    />
                </div>
            </div>
            <div className='col-12 col-lg-3'>
                <div className='mb-4 col-6 col-lg-12'>
                    <Select
                        data={thirdDropdownOptions.map(option =>
                            typeof option === 'string'
                                ? { value: option, label: option }
                                : option // interests already is an object with value and label
                        )}
                        searchable
                        rightSection={<IconChevronDown size="1rem" />}
                        rightSectionWidth={30}
                        styles={{ rightSection: { pointerEvents: 'none' }, input: { cursor: 'pointer' } }}
                        value={row.third}
                        placeholder="Select Sub-category"
                        onChange={(value) => handleDropdownChange(rowId, "third", value)}
                    />
                </div>
            </div>
            <div className='col-12 col-lg-1'>
                <ActionIcon onClick={() => deleteRow(rowId)} color='red' variant='subtle' size={'sm'}>
                    <IconTrash />
                </ActionIcon>
            </div>
            <div className='col-12 col-lg-2'>
                {figures !== null ? figures : '-'}
            </div>
        </React.Fragment>
    );
};

export default DropdownRow;