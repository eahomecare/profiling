import { useDispatch, useSelector } from "react-redux";
import { setEventName, setEventDate } from "../../../../redux/campaignManagementSlice"; // Import the necessary action
import { Flex, Group, Stack, Text, TextInput } from "@mantine/core";
import DatePicker from "react-datepicker";

const Step1 = () => {
    const dispatch = useDispatch();
    const eventName = useSelector(state => state.campaignManagement.eventName); // Get eventName directly from the store
    const eventDate = useSelector(state => state.campaignManagement.eventDate); // Get eventDate directly from the store

    return (
        <>
            <div className='' style={{ minHeight: '300px' }}>
                <Flex justify={'space-around'}>
                    <TextInput
                        mt={40}
                        id="eventName"
                        name="eventName"
                        placeholder="Event Name"
                        className="custom-class inputs-control"
                        type="text"
                        value={eventName}
                        onChange={evt => dispatch(setEventName(evt.currentTarget.value))}
                    />
                    <Stack >
                        <label className='date-inputs-control'>Event date</label>
                        <DatePicker className='form-control  inputs-control form-floating date-icon'
                            dateFormat="yyyy/MM/dd"
                            selected={eventDate}
                            onChange={(date) => {
                                console.log("Selected Date:", date);
                                dispatch(setEventDate(date));
                            }}
                            minDate={new Date()}
                        />
                    </Stack>
                </Flex>
            </div>
        </>
    );
};

export default Step1;