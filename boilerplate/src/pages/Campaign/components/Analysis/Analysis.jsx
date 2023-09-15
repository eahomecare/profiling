import React, { useEffect } from 'react';
import DropdownRow from './DropdownRow';
import '../../_customer-Profile.scss';
import "../../scss/_variables.scss";
import "../../scss/_mixins.scss";
import "../../scss/_card.scss";
import 'bootstrap/dist/css/bootstrap.css';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords } from '../../../../redux/keywordSlice';
import { IconPlus } from '@tabler/icons-react';
import { ActionIcon, Box, Flex, Group, Text } from '@mantine/core';
import { toggleModal, updateDropdownData, updateRows, updateSelectedCombinations } from '../../../../redux/campaignManagementSlice';
import Demographic from './Demographic';

const Analysis = () => {
    const dispatch = useDispatch();

    const {
        isModalOpen,
        dropdownData,
        rows,
        selectedCombinations
    } = useSelector(state => state.campaignManagement);

    useEffect(() => {
        dispatch(getKeywords());
    }, [dispatch]);

    const keywords = useSelector(state => state.keyword.keywords);
    console.log(keywords, keywords)
    const keywordsStatus = useSelector(state => state.keyword.keywordsStatus);

    if (keywordsStatus === 'loading') {
        console.log('loading...')
    }

    if (keywordsStatus === 'failed') {
        console.log('Error getting keywords')
    }

    useEffect(() => {
        if (keywordsStatus === 'success') {
            let updatedDropdownData = { ...dropdownData.Interests };

            keywords.forEach(keyword => {
                const updatedCategory = updatedDropdownData[keyword.category]
                    ? [...updatedDropdownData[keyword.category], { label: keyword.value, value: keyword.id }]
                    : [{ label: keyword.value, value: keyword.id }];

                updatedDropdownData = {
                    ...updatedDropdownData,
                    [keyword.category]: updatedCategory
                };
            });

            const finalDropdownData = {
                ...dropdownData,
                Interests: updatedDropdownData
            };

            dispatch(updateDropdownData(finalDropdownData));
        }
    }, [keywordsStatus, keywords]);

    const handleDropdownChange = (rowId, dropdown, value) => {
        const updatedRows = { ...rows };
        updatedRows[rowId] = {
            ...updatedRows[rowId],
            [dropdown]: value
        };

        let updatedCombinations = [...selectedCombinations];

        if (dropdown === "first") {
            updatedRows[rowId].second = "";
            updatedRows[rowId].third = "";
        } else if (dropdown === "second") {
            updatedRows[rowId].third = "";
        } else if (dropdown === "third") {
            let thirdValue;
            if (updatedRows[rowId].first === "Interests") {
                thirdValue = dropdownData[updatedRows[rowId].first][updatedRows[rowId].second].find(opt => opt.value === value);
            } else {
                thirdValue = value;
            }

            updatedCombinations = updatedCombinations.filter(combination => combination.rowId !== rowId);

            updatedCombinations.push({
                rowId,
                first: updatedRows[rowId].first,
                second: updatedRows[rowId].second,
                third: thirdValue
            });
        }

        dispatch(updateRows(updatedRows));
        dispatch(updateSelectedCombinations(updatedCombinations));
    };

    const addRow = () => {
        const newRow = {
            [Date.now().toString()]: {
                first: "",
                second: "",
                third: ""
            }
        };
        dispatch(updateRows({ ...rows, ...newRow }));
    };

    const deleteRow = (rowId) => {
        const updatedRows = { ...rows };
        delete updatedRows[rowId];

        const updatedSelectedCombinations = selectedCombinations.filter(combination => combination.rowId !== rowId);

        dispatch(updateRows(updatedRows));
        dispatch(updateSelectedCombinations(updatedSelectedCombinations));
    };

    const handleModalToggle = (status) => {
        dispatch(toggleModal(status));
    };

    return (
        <>
            <div className='col-xs-12 col-lg-12'>
                <div className='chart-bx mb-5'>
                    <div className='row'>
                        <div className='col-12 col-lg-8'>
                            <div className='col-12 col-lg-12 mb-3'>
                                <Flex justify={'space-between'}>
                                    <div className='bx-title mb-2 dis-inline'>
                                        <h1>Customer Profile Analysis</h1>
                                    </div>
                                    <div className='pl-90'>
                                        <Group onClick={addRow} style={{ cursor: 'pointer' }}>
                                            <ActionIcon color='blue' variant='subtle' size={'sm'}>
                                                <IconPlus color='#4E70EA' />
                                            </ActionIcon>
                                            <Text ml={-18} color='#4E70EA' size={'sm'}>Add More</Text>
                                        </Group>
                                    </div>
                                </Flex>
                            </div>
                            <div className='row' style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                                <div className='col-12 col-lg-3'>
                                    <div className='select-title mb-3'>
                                        <h1>Select Information Type</h1>
                                    </div>
                                </div>
                                <div className='col-12 col-lg-3'>
                                    <div className='select-title mb-3'>
                                        <h1>Select Category</h1>
                                    </div>
                                </div>
                                <div className='col-12 col-lg-3'>
                                    <div className='select-title mb-3'>
                                        <h1>Select Sub-category</h1>
                                    </div>
                                </div>
                                <div className='col-12 col-lg-1'>
                                    <div className='select-title mb-3'>
                                        <h1>Delete</h1>
                                    </div>
                                </div>
                                <div className='col-12 col-lg-2'>
                                    <div className='select-title mb-3'>
                                        <h1>Figures</h1>
                                    </div>
                                </div>
                                {Object.entries(rows).map(([rowId, rowData]) => (
                                    <DropdownRow
                                        key={rowId}
                                        row={rowData}
                                        rowId={rowId}
                                        handleDropdownChange={handleDropdownChange}
                                        dropdownData={dropdownData}
                                        selectedCombinations={selectedCombinations}
                                        deleteRow={deleteRow}
                                    />
                                ))}
                            </div>
                            {/* <ButtonGroup
                                isModalOpen={isModalOpen}
                                setIsModalOpen={handleModalToggle}
                            /> */}
                        </div>
                        <Demographic />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Analysis;