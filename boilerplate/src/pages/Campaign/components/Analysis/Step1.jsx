import { useDispatch, useSelector } from "react-redux";
import { setEventName, setEventDate } from "../../../../redux/campaignManagementSlice";
import { ActionIcon, Flex, Group, Stack, Text, TextInput } from "@mantine/core";
import DatePicker from "react-datepicker";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const Step1 = () => {
    const dispatch = useDispatch();
    const eventName = useSelector(state => state.campaignManagement.eventName);
    const eventDate = useSelector(state => state.campaignManagement.eventDate);

    return (
        <>
            <div className='' style={{ minHeight: '100px' }}>
                <Flex justify={'space-around'}>
                    <Stack>
                        <label className='date-inputs-control'>Event Name</label>
                        <TextInput
                            id="eventName"
                            w={400}
                            name="eventName"
                            placeholder="Event Name"
                            type="text"
                            value={eventName}
                            onChange={evt => dispatch(setEventName(evt.currentTarget.value))}
                        />
                    </Stack>
                    <Stack >
                        <label className='date-inputs-control'>Event date</label>
                        {/* <DatePicker
                            className='form-control  form-floating date-icon'
                            dateFormat="yyyy/MM/dd"
                            style={{ zIndex: 1000 }}
                            selected={eventDate}
                            onChange={(date) => {
                                console.log("Selected Date:", date);
                                dispatch(setEventDate(date));
                            }}
                            minDate={new Date()}
                        /> */}
                        <DatePickerInput
                            value={eventDate}
                            popoverProps={{ withinPortal: true }}
                            rightSection={<ActionIcon variant="subtle"><IconCalendar size="1.1rem" stroke={1.5} /></ActionIcon>}
                            onChange={(date) => {
                                console.log("Selected Date:", date);
                                dispatch(setEventDate(date));
                            }}
                            minDate={new Date()}
                            w={200}
                        />
                    </Stack>
                </Flex>
            </div>
        </>
    );
};

export default Step1;