import { useDispatch, useSelector } from "react-redux";
import {
  setEventName,
  setEventDate,
} from "../../../../redux/campaignManagementSlice";
import { ActionIcon, Flex, Group, Stack, Text, TextInput } from "@mantine/core";
import DatePicker from "react-datepicker";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import StyledTextInput from "../../../../StyledComponents/StyledTextInput";
import StyledDateInput from "../../../../StyledComponents/StyledDateInput";

const Step1 = () => {
  const dispatch = useDispatch();
  const eventName = useSelector((state) => state.campaignManagement.eventName);
  const eventDate = useSelector((state) => state.campaignManagement.eventDate);

  return (
    <>
      <div className="" style={{ minHeight: "100px" }}>
        <Flex justify={"space-around"}>
          <Stack>
            <StyledTextInput
              label={"Event Name"}
              id="eventName"
              w={400}
              name="eventName"
              placeholder="Event Name"
              type="text"
              value={eventName}
              onChange={(evt) =>
                dispatch(setEventName(evt.currentTarget.value))
              }
            />
          </Stack>
          <Stack>
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
            {/* <DatePickerInput */}
            {/*   label="Event Date" */}
            {/*   value={eventDate} */}
            {/*   popoverProps={{ withinPortal: true }} */}
            {/*   rightSection={ */}
            {/*     <ActionIcon variant="subtle"> */}
            {/*       <IconCalendar size="1.1rem" stroke={1.5} /> */}
            {/*     </ActionIcon> */}
            {/*   } */}
            <StyledDateInput
              label="Event Date"
              value={eventDate}
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
