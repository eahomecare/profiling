import { useDispatch, useSelector } from "react-redux";
import { setEventName, setEventDate } from "../../../../redux/campaignManagementSlice"; // Import the necessary action
import { Group, Text, TextInput } from "@mantine/core";
import DatePicker from "react-datepicker";

const Step1 = () => {
    const dispatch = useDispatch();
    const eventName = useSelector(state => state.campaignManagement.eventName); // Get eventName directly from the store
    const eventDate = useSelector(state => state.campaignManagement.eventDate); // Get eventDate directly from the store

    return (
        <>
            <div className='mb-30 mt-5' style={{ minHeight: '500px' }}>
                <Group>
                    <TextInput
                        id="eventName"
                        name="eventName"
                        placeholder="Event Name"
                        className="custom-class inputs-control"
                        type="text"
                        value={eventName}
                        onChange={evt => dispatch(setEventName(evt.currentTarget.value))}
                    />
                </Group>
                <Group>
                    <div className='col-6 col-lg-6 mt-5'>
                        <div className='mb-40'>
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
                        </div>
                    </div>
                </Group>
            </div>
        </>
    );
};

export default Step1;