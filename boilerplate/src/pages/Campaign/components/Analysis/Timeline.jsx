import { ActionIcon, Badge, Box, Button, Card, Divider, Flex, Stack, rem } from "@mantine/core";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { setEventDate } from '../../../../redux/campaignManagementSlice';
import CustomDate from "./CustomTimelineComponents/CustomDate";
import CustomTime from "./CustomTimelineComponents/CustomTime";
import { IconChevronDown, IconPlus, IconX } from "@tabler/icons-react";
import { formatDateTime } from "./CustomTimelineComponents/DateFormatter";

const Timeline = ({ initialState, onUpdate, onApplyForAll }) => {

    const dispatch = useDispatch();
    const eventDate = useSelector(state => state.campaignManagement.eventDate);

    const defaultStartDate = new Date();

    const defaultResults = {
        startDate: defaultStartDate,
        endDate: null,
        recurrence: {
            type: '',
            dailyFrequency: 1,
            weeklyDays: [],
            monthlyDay: '',
            monthlyFrequency: '',
            monthlyWeekday: '',
            customDateTimes: []
        }
    };

    const [startDate, setStartDate] = useState(initialState.startDate || defaultStartDate);
    const [results, setResults] = useState(initialState.recurrence ? initialState : defaultResults);

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const monthlyFrequencies = ['first', 'second', 'third', 'fourth'];

    const [showDropdown, setShowDropdown] = useState(false);
    const [customDateTimes, setCustomDateTimes] = useState(results.recurrence.customDateTimes || []);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const addCustomDate = () => {
        if (selectedDate && selectedTime) {
            const newCustomDateTime = { date: selectedDate, time: selectedTime };
            setCustomDateTimes([...customDateTimes, newCustomDateTime]);
            setResults(prevState => ({
                ...prevState,
                recurrence: {
                    ...prevState.recurrence,
                    customDateTimes: [...prevState.recurrence.customDateTimes, newCustomDateTime]
                }
            }));
            setSelectedDate(null);
            setSelectedTime(null);
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if (selectedDate && selectedTime) {
            addCustomDate();
        }
    }, [selectedDate, selectedTime]);

    useEffect(() => {
        onUpdate(results);
    }, [results]);

    const handleDateChange = (field, date) => {
        setResults(prevState => ({
            ...prevState,
            [field]: date,
        }));

        if (field === "startDate") {
            setStartDate(date);
        } else if (field === "endDate") {
            dispatch(setEventDate(date));
        }
    };

    const removeCustomDate = (indexToRemove) => {
        const updatedCustomDateTimes = customDateTimes.filter((_, index) => index !== indexToRemove);
        setCustomDateTimes(updatedCustomDateTimes);

        setResults(prevState => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                customDateTimes: updatedCustomDateTimes
            }
        }));
    };

    const handleRecurrenceChange = (field, value) => {
        setResults(prevState => ({
            ...prevState,
            recurrence: {
                ...prevState.recurrence,
                [field]: value,
            },
        }));
    };

    const handleDailyFrequencyChange = (value) => {
        let updatedValue = value !== 'Everyday' ? parseInt(value, 10) : 'Everyday';
        handleRecurrenceChange('dailyFrequency', updatedValue);
    };

    const handleWeeklyDaysChange = (day) => {
        const updatedDays = results.recurrence.weeklyDays.includes(day)
            ? results.recurrence.weeklyDays.filter(d => d !== day)
            : [...results.recurrence.weeklyDays, day];

        handleRecurrenceChange('weeklyDays', updatedDays);
    };

    const handleMonthlyDayAndFrequencyChange = (field, value) => {
        handleRecurrenceChange(field, parseInt(value, 10));
    };

    return (
        <div>
            <Divider mb={10} />
            <div className='col-12 col-lg-12'>
                <div className='time-title mb-20'>
                    <Flex justify={'space-between'}>
                        <h1>
                            Timeline
                        </h1>
                        <Badge
                            styles={{ root: { cursor: 'pointer' } }}
                            onClick={() => onApplyForAll(results)}>Apply For All</Badge>
                    </Flex>
                </div>
            </div>

            <Flex>
                <div className='col-6 col-lg-6'>
                    <div className='mb-40'>
                        <label htmlFor="startDate" className='date-inputs-control'>Start date</label>
                        <DatePicker className='form-control  inputs-control form-floating date-icon'
                            dateFormat="yyyy/MM/dd"
                            selected={startDate}
                            onChange={(date) => handleDateChange("startDate", date)}
                            minDate={new Date()} />
                    </div>
                </div>

                <div className='col-6 col-lg-6'>
                    <div className='mb-40'>
                        <label htmlFor="endDate" className='date-inputs-control'>End date</label>
                        <DatePicker className='form-control  inputs-control form-floating date-icon'
                            dateFormat="yyyy/MM/dd"
                            selected={eventDate}
                            onChange={(date) => handleDateChange("endDate", date)}
                            minDate={new Date()} />
                    </div>
                </div>
            </Flex>
            <div className='col-12 col-lg-12'>
                <div className='time-title mb-20'>
                    <h1>Recurrence</h1>
                </div>
            </div>
            <div className='row'>
                <div className='col-12 col-lg-4'>
                    <div className='mb-25 mt-10'>
                        <div className="form-check">
                            <input className="form-check-input check-recu" type="radio" name="recurrence" id="daily" value="Daily"
                                checked={results.recurrence.type === 'Daily'} onChange={e => handleRecurrenceChange('type', e.target.value)} />
                            <label className="form-check-label check-label" htmlFor="daily">Daily</label>
                        </div>
                    </div>
                    <div className='mb-25'>
                        <div className="form-check">
                            <input className="form-check-input check-recu" type="radio" name="recurrence" id="weekly" value="Weekly"
                                checked={results.recurrence.type === 'Weekly'} onChange={e => handleRecurrenceChange('type', e.target.value)} />
                            <label className="form-check-label check-label" htmlFor="weekly">Weekly</label>
                        </div>
                    </div>
                    <div className='mb-25'>
                        <div className="form-check">
                            <input className="form-check-input check-recu" type="radio" name="recurrence" id="monthly" value="Monthly"
                                checked={results.recurrence.type === 'Monthly'} onChange={e => handleRecurrenceChange('type', e.target.value)} />
                            <label className="form-check-label check-label" htmlFor="monthly">Monthly</label>
                        </div>
                    </div>
                    <div className='mb-25'>
                        <div className="form-check">
                            <input className="form-check-input check-recu" type="radio" name="recurrence" id="custom" value="Custom"
                                checked={results.recurrence.type === 'Custom'} onChange={e => handleRecurrenceChange('type', e.target.value)} />
                            <label className="form-check-label check-label" htmlFor="custom">Custom</label>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-8'>
                    {results.recurrence.type === 'Daily' && (
                        <div className='col-6 col-lg-3'>
                            <div className='mb-20 mt-10'>
                                <div className="form-check">
                                    <input className="form-check-input check-recu " type="radio" name="dailyOption" id="everyNDaysOption" value="EveryNDays"
                                        onChange={() => handleRecurrenceChange('dailyFrequency', 'EveryNDays')} />
                                    <label className="form-check-label check-label chkinput" htmlFor="everyNDaysOption">
                                        Every <span><input id="dailyFrequencyInput" name="dailyFrequencyInput" type="number" min="1" className='day-no' value={results.recurrence.dailyFrequency} onChange={e => handleDailyFrequencyChange(e.target.value)} /></span>day(s)
                                    </label>
                                </div>
                            </div>
                            <div className='mb-20'>
                                <div className="form-check">
                                    <input className="form-check-input check-recu" type="radio" name="dailyOption" id="everydayOption" value="Everyday"
                                        checked={results.recurrence.dailyFrequency === 'Everyday'}
                                        onChange={() => handleRecurrenceChange('dailyFrequency', 'Everyday')} />
                                    <label className="form-check-label check-label" htmlFor="everydayOption">
                                        Everyday
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='row'>
                        {results.recurrence.type === 'Weekly' && weekDays.map(day => (
                            <div className='col-2 col-lg-4'>
                                <div key={day} className='mb-15 dis-inline web-dis-inline web-mb-0'>
                                    <div className="form-check from-mrg-rtl mb-15">
                                        <input
                                            className="form-check-input check-recu"
                                            type="checkbox"
                                            value={day}
                                            checked={results.recurrence.weeklyDays.includes(day)}
                                            onChange={() => handleWeeklyDaysChange(day)}
                                        />
                                        <label className="form-check-label check-label">
                                            {day}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {results.recurrence.type === 'Monthly' && (
                        <div className='col-6 col-lg-9'>
                            <div className='clearfix'>
                                <div className='mb-25 mt-10'>
                                    <div className="form-check">
                                        <input className="form-check-input check-recu" type="radio" name="monthlyOption" id="monthlyOption1" />
                                        <label className="form-check-label check-label chkinput">
                                            Day <input
                                                type="number"
                                                className='day-no'
                                                onChange={e => handleMonthlyDayAndFrequencyChange('monthlyDay', e.target.value)}
                                            />
                                            of every <input
                                                type="number"
                                                className='day-no'
                                                onChange={e => handleMonthlyDayAndFrequencyChange('monthlyFrequency', e.target.value)}
                                            /> month(s)
                                        </label>
                                    </div>
                                </div>

                                <div className='mb-25 mt-10'>
                                    <div className="form-check">
                                        <input className="form-check-input check-recu" type="radio" name="monthlyOption" id="monthlyOption2" />
                                        <label className="form-check-label check-label chkinput" htmlFor="monthlyOption2">
                                            Day <input type="number" className='day-no' />
                                            of every
                                            <span className='mrg-ltr'>
                                                <select className="form-select dropday" onChange={e => handleRecurrenceChange('monthlyFrequency', e.target.value)}>
                                                    {monthlyFrequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                                                </select>
                                            </span>
                                            <span className='mrg-ltr mrg-rtl'>
                                                <select className="form-select dropday" onChange={e => handleRecurrenceChange('monthlyWeekday', e.target.value)}>
                                                    {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
                                                </select>
                                            </span> of every month(s)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {results.recurrence.type === 'Custom' && (
                        <div>
                            <Flex wrap={"wrap"}>
                                <Flex mr={5} wrap={'wrap'}>
                                    {customDateTimes.map((item, index) => (
                                        <Badge
                                            rightSection={
                                                <ActionIcon
                                                    size="xs"
                                                    color="blue"
                                                    radius="xl"
                                                    variant="transparent"
                                                    onClick={() => removeCustomDate(index)} // Add this onClick event here
                                                >
                                                    <IconX size={rem(10)} />
                                                </ActionIcon>
                                            }
                                            size="lg"
                                            mr={5}
                                            mb={5}
                                            key={index}
                                        >
                                            {formatDateTime(item.date, item.time)}
                                        </Badge>
                                    ))}
                                </Flex>
                                <Stack>
                                    <Badge
                                        bg={'white'}
                                        c={'gray'}
                                        styles={{ root: { borderWidth: '1px', borderColor: 'gray', } }}
                                        leftSection={<ActionIcon size={rem(20)}><IconPlus /></ActionIcon>}
                                        rightSection={<ActionIcon><IconChevronDown /></ActionIcon>}
                                        onClick={() => setShowDropdown(!showDropdown)}>Add More</Badge>
                                    {showDropdown && (
                                        <Box>
                                            <Box shadow="lg" w={200}>
                                                <CustomDate setSelectedDate={setSelectedDate} />
                                                <CustomTime setSelectedTime={setSelectedTime} />
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </Flex>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Timeline;