import StyledTimeInput from "../../../../../StyledComponents/StyledTimeInput";

function CustomTime({ setSelectedTime, timeSelected }) {
  return (
    <StyledTimeInput
      value={timeSelected ? timeSelected : ""}
      label={"Time"}
      onChange={(e) => setSelectedTime(e.target.value)}
    />
  );
}

export default CustomTime;
