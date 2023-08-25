import React, { useEffect } from 'react';
import DropdownRow from './DropdownRow';
import ButtonGroup from './ButtonGroup';
import '../../_customer-Profile.scss';
import "../../scss/_variables.scss";
import "../../scss/_mixins.scss";
import "../../scss/_card.scss";
import 'bootstrap/dist/css/bootstrap.css';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { getKeywords } from '../../../../redux/keywordSlice';
import { IconPlus } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { toggleModal, updateDropdownData, updateRows, updateSelectedCombinations } from '../../../../redux/campaignManagementSlice';

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
    const keywordsStatus = useSelector(state => state.keyword.keywordsStatus);

    if (keywordsStatus === 'loading') {
        console.log('loading...')
    }

    if (keywordsStatus === 'failed') {
        console.log('Error getting keywords')
    }

    useEffect(() => {
        if (keywordsStatus === 'success') {
            const updatedDropdownData = { ...dropdownData.Interests };

            keywords.forEach(keyword => {
                if (!updatedDropdownData[keyword.category]) {
                    updatedDropdownData[keyword.category] = [];
                }
                updatedDropdownData[keyword.category].push({ label: keyword.value, value: keyword.id });
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
        <div className='col-xs-12 col-lg-12'>
            <div className='chart-bx mb-5'>
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                        <div className='col-12 col-lg-12 mb-3'>
                            <div className='bx-title mb-2 dis-inline'>
                                <h1>Customer Profile Analysis</h1>
                                <ActionIcon onClick={addRow} color='blue' variant='subtle' size={'sm'}>
                                    <IconPlus />
                                </ActionIcon>
                            </div>
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
                        <ButtonGroup
                            isModalOpen={isModalOpen}
                            setIsModalOpen={handleModalToggle}
                        />
                    </div>
                    <div className='col-12 col-lg-4'>
                        <div className='dem-grapic clearfix'>
                            <div className='dem-title mb-4'>
                                <h1>Total Demographic</h1>
                            </div>
                            <div className='fullwidth mb-2'>
                                {/* <Pie className='mrg-auto' data={data} /> */}
                            </div>
                            <div className='row mt-2'>
                                <div className='col-12 col-lg-12 text-center mb-2'>
                                    <span className='total-numb pe-2'>18,24,7,000</span>
                                    <span className='total-users'> Users matching your criteria</span>
                                </div>
                                <div className='col-12 col-lg-6 web-mb-20'>
                                    <button type='button' className='btn datebtn'>Download Data</button>
                                </div>
                                <div className='col-12 col-lg-6'>
                                    <button type='button' className='btn runcamp'>Run Campaing</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analysis;