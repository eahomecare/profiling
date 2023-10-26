import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Stack,
  rem,
  Group,
  Text,
  Checkbox,
  Grid,
  Center,
} from "@mantine/core";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setEventDate } from "../../../../redux/campaignManagementSlice";
import CustomDate from "./CustomTimelineComponents/CustomDate";
import CustomTime from "./CustomTimelineComponents/CustomTime";
import { IconChevronDown, IconPlus, IconX } from "@tabler/icons-react";
import { formatDateTime } from "./CustomTimelineComponents/DateFormatter";
import StyledDateInput from "../../../../StyledComponents/StyledDateInput";
import StyledBadge from "../../../../StyledComponents/StyledBadge";
import StyledCheckBox from "../../../../StyledComponents/StyledCheckBox";
import StyledTextInput from "../../../../StyledComponents/StyledTextInput";
import StyledSelect from "../../../../StyledComponents/StyledSelect";

const Timeline = ({ initialState, onUpdate, onApplyForAll }) => {
  const dispatch = useDispatch();
  const eventDate = useSelector((state) => state.campaignManagement.eventDate);

  const defaultStartDate = new Date();

  const defaultResults = {
    startDate: defaultStartDate,
    endDate: null,
    recurrence: {
      type: "",
      recurrenceTime: "",
      dailyFrequency: 1,
      weeklyDays: [],
      monthlyDay: "",
      monthlyFrequency: "",
      monthlyWeekday: "",
      customDateTimes: [],
    },
  };

  const [startDate, setStartDate] = useState(
    initialState.startDate || defaultStartDate,
  );
  const [results, setResults] = useState(
    initialState.recurrence ? initialState : defaultResults,
  );
  console.log("results", results);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthlyFrequencies = ["first", "second", "third", "fourth"];

  const [showDropdown, setShowDropdown] = useState(false);
  const [customDateTimes, setCustomDateTimes] = useState(
    results.recurrence.customDateTimes || [],
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [recurrenceTime, setRecurrenceTime] = useState(
    results.recurrence.recurrenceTime || "",
  );

  const addCustomDate = () => {
    if (selectedDate && selectedTime) {
      const newCustomDateTime = { date: selectedDate, time: selectedTime };
      setCustomDateTimes([...customDateTimes, newCustomDateTime]);
      setResults((prevState) => ({
        ...prevState,
        recurrence: {
          ...prevState.recurrence,
          customDateTimes: [
            ...prevState.recurrence.customDateTimes,
            newCustomDateTime,
          ],
        },
      }));
      setSelectedDate(null);
      setSelectedTime(null);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (recurrenceTime) {
      setResults((prevState) => ({
        ...prevState,
        recurrence: {
          ...prevState.recurrence,
          recurrenceTime: recurrenceTime,
        },
      }));
    }
  }, [recurrenceTime]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      addCustomDate();
    }
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    onUpdate(results);
  }, [results]);

  const handleDateChange = (field, date) => {
    setResults((prevState) => ({
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
    const updatedCustomDateTimes = customDateTimes.filter(
      (_, index) => index !== indexToRemove,
    );
    setCustomDateTimes(updatedCustomDateTimes);

    setResults((prevState) => ({
      ...prevState,
      recurrence: {
        ...prevState.recurrence,
        customDateTimes: updatedCustomDateTimes,
      },
    }));
  };

  const handleRecurrenceChange = (field, value) => {
    setResults((prevState) => ({
      ...prevState,
      recurrence: {
        ...prevState.recurrence,
        [field]: value,
      },
    }));
  };

  const handleDailyFrequencyChange = (value) => {
    let updatedValue = value !== "Everyday" ? parseInt(value, 10) : "Everyday";
    handleRecurrenceChange("dailyFrequency", updatedValue);
  };

  const handleWeeklyDaysChange = (day) => {
    const updatedDays = results.recurrence.weeklyDays.includes(day)
      ? results.recurrence.weeklyDays.filter((d) => d !== day)
      : [...results.recurrence.weeklyDays, day];

    handleRecurrenceChange("weeklyDays", updatedDays);
  };

  const handleMonthlyDayAndFrequencyChange = (field, value) => {
    handleRecurrenceChange(field, parseInt(value, 10));
  };

  return (
    <div>
      <Divider c="#2B1DFD" mb={10} />
      <Stack>
        <Stack>
          <Flex justify={"space-between"}>
            <Text size="lg" fw={"normal"} c="#2B1DFD">
              Timeline
            </Text>
            <StyledBadge onClick={() => onApplyForAll(results)}>
              Apply For All
            </StyledBadge>
          </Flex>

          <Group grow>
            <div className="col-6 col-lg-6">
              <div className="mb-40">
                {/* <DatePicker */}
                {/*   className="form-control  inputs-control form-floating date-icon" */}
                {/*   dateFormat="yyyy/MM/dd" */}
                {/*   selected={startDate} */}
                {/*   onChange={(date) => handleDateChange("startDate", date)} */}
                {/*   minDate={new Date()} */}
                {/* /> */}
                <StyledDateInput
                  label={"Start Date"}
                  value={startDate}
                  onChange={(date) => handleDateChange("startDate", date)}
                  minDate={new Date()}
                />
              </div>
            </div>

            <div className="col-6 col-lg-6">
              <div className="mb-40">
                {/* <DatePicker */}
                {/*   className="form-control  inputs-control form-floating date-icon" */}
                {/*   dateFormat="yyyy/MM/dd" */}
                {/*   selected={eventDate} */}
                {/*   onChange={(date) => handleDateChange("endDate", date)} */}
                {/*   minDate={new Date()} */}
                {/* /> */}
                <StyledDateInput
                  label={"End Date"}
                  value={eventDate}
                  onChange={(date) => handleDateChange("endDate", date)}
                  minDate={new Date()}
                />
              </div>
            </div>
          </Group>
        </Stack>
        <Text size="lg" fw={"normal"} c="#2B1DFD">
          {" "}
          Recurrence{" "}
        </Text>
        <Grid grow>
          <Grid.Col span={3}>
            <Stack>
              <StyledCheckBox
                label={"Daily"}
                checked={results.recurrence.type === "Daily"}
                value="Daily"
                onChange={(e) => handleRecurrenceChange("type", e.target.value)}
              />
              <StyledCheckBox
                label={"Weekly"}
                value="Weekly"
                checked={results.recurrence.type === "Weekly"}
                onChange={(e) => handleRecurrenceChange("type", e.target.value)}
              />
              <StyledCheckBox
                label={"Monthly"}
                value="Monthly"
                checked={results.recurrence.type === "Monthly"}
                onChange={(e) => handleRecurrenceChange("type", e.target.value)}
              />
              <StyledCheckBox
                label={"Custom"}
                value="Custom"
                checked={results.recurrence.type === "Custom"}
                onChange={(e) => handleRecurrenceChange("type", e.target.value)}
              />
            </Stack>
          </Grid.Col>
          {/* This */}
          <Grid.Col span={9}>
            {results.recurrence.type === "Daily" && (
              <Stack>
                <Group>
                  <StyledCheckBox
                    value="EveryNDays"
                    checked={results.recurrence.dailyFrequency === "EveryNDays"}
                    onChange={() =>
                      handleRecurrenceChange("dailyFrequency", "EveryNDays")
                    }
                  />
                  Every{" "}
                  <StyledTextInput
                    w={50}
                    type="number"
                    min="1"
                    value={results.recurrence.dailyFrequency}
                    onChange={(e) => handleDailyFrequencyChange(e.target.value)}
                  />
                  day(s)
                </Group>
                <StyledCheckBox
                  label={"Everyday"}
                  value="Everyday"
                  checked={results.recurrence.dailyFrequency === "Everyday"}
                  onChange={() =>
                    handleRecurrenceChange("dailyFrequency", "Everyday")
                  }
                />
              </Stack>
            )}

            <Grid grow>
              {results.recurrence.type === "Weekly" &&
                weekDays.map((day) => (
                  <Grid.Col span={4}>
                    <StyledCheckBox
                      label={day}
                      value={day}
                      checked={results.recurrence.weeklyDays.includes(day)}
                      onChange={() => handleWeeklyDaysChange(day)}
                    />
                  </Grid.Col>
                ))}
            </Grid>

            {results.recurrence.type === "Monthly" && (
              //
              <Box>
                <Group grow>
                  {/* TODO Fix */}
                  <StyledCheckBox />
                  {/* <input */}
                  {/*   className="form-check-input check-recu" */}
                  {/*   type="radio" */}
                  {/*   name="monthlyOption" */}
                  {/*   id="monthlyOption1" */}
                  {/* /> */}
                  Day{" "}
                  <StyledTextInput
                    w={50}
                    type="number"
                    min="1"
                    onChange={(e) =>
                      handleMonthlyDayAndFrequencyChange(
                        "monthlyDay",
                        e.target.value,
                      )
                    }
                  />
                  of every{" "}
                  <StyledTextInput
                    w={50}
                    type="number"
                    min="1"
                    onChange={(e) =>
                      handleMonthlyDayAndFrequencyChange(
                        "monthlyFrequency",
                        e.target.value,
                      )
                    }
                  />{" "}
                  month(s)
                </Group>
                {/**/}
                <Group spacing={1} grow>
                  {/* TODO Fix */}
                  <StyledCheckBox />
                  {/* <input */}
                  {/*   className="form-check-input check-recu" */}
                  {/*   type="radio" */}
                  {/*   name="monthlyOption" */}
                  {/*   id="monthlyOption2" */}
                  {/* /> */}
                  Day
                  <StyledTextInput type="number" />
                  of every
                  <StyledSelect
                    miw={"23%"}
                    onChange={(e) =>
                      handleRecurrenceChange("monthlyFrequency", e)
                    }
                    data={monthlyFrequencies}
                  />
                  <StyledSelect
                    miw={"31%"}
                    onChange={(e) =>
                      handleRecurrenceChange("monthlyWeekday", e)
                    }
                    data={weekDays}
                  />{" "}
                  of every month(s)
                </Group>
              </Box>
            )}
            {results.recurrence.type !== "Custom" &&
              (results.recurrence.type === "Daily" ||
                results.recurrence.type === "Weekly" ||
                results.recurrence.type === "Monthly") && (
                <Center>
                  <Box w={100}>
                    <CustomTime
                      setSelectedTime={setRecurrenceTime}
                      timeSelected={recurrenceTime}
                    />
                  </Box>
                </Center>
              )}
            {results.recurrence.type === "Custom" && (
              <div>
                <Flex wrap={"wrap"}>
                  <Flex mr={5} wrap={"wrap"}>
                    {customDateTimes.map((item, index) => (
                      <StyledBadge
                        rightSection={
                          <ActionIcon
                            size="xs"
                            c="#2B1DFD"
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
                      </StyledBadge>
                    ))}
                  </Flex>
                  <Stack>
                    <Badge
                      bg={"white"}
                      c={"gray"}
                      styles={{
                        root: { borderWidth: "1px", borderColor: "gray" },
                      }}
                      leftSection={
                        <ActionIcon size={rem(20)}>
                          <IconPlus />
                        </ActionIcon>
                      }
                      rightSection={
                        <ActionIcon>
                          <IconChevronDown />
                        </ActionIcon>
                      }
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      Add More
                    </Badge>
                    {showDropdown && (
                      <Box>
                        <Box shadow="lg" w={200}>
                          <CustomDate setSelectedDate={setSelectedDate} />
                          <CustomTime
                            setSelectedTime={setSelectedTime}
                            timeSelected={selectedTime}
                          />
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Flex>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  );
};

export default Timeline;
