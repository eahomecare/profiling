import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiguresForRow } from "../../../../redux/campaignManagementSlice";
import { ActionIcon, Flex, Loader, Select } from "@mantine/core";
import {
  IconChevronDown,
  IconExclamationMark,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import StyledSelect from "../../../../StyledComponents/StyledSelect";

const DropdownRow = ({
  row,
  rowId,
  handleDropdownChange,
  dropdownData,
  selectedCombinations,
  deleteRow,
}) => {
  const figures = row.figures;
  const secondDropdownOptions = row.first
    ? Object.keys(dropdownData[row.first])
    : [];

  const thirdDropdownOptions = row.second
    ? dropdownData[row.first][row.second].filter((option) => {
      const currentCombination = {
        first: row.first,
        second: row.second,
        third: row.first === "Interests" ? option.value : option,
      };

      const isSelectedCombination = selectedCombinations.some(
        (selected) =>
          selected.first === currentCombination.first &&
          selected.second === currentCombination.second &&
          (row.first === "Interests"
            ? selected.third.value
            : selected.third) === currentCombination.third,
      );

      const isSelectedInCurrentRow = selectedCombinations.some(
        (selected) =>
          selected.rowId === rowId &&
          selected.first === currentCombination.first &&
          selected.second === currentCombination.second &&
          (row.first === "Interests"
            ? selected.third.value
            : selected.third) === currentCombination.third,
      );

      return !isSelectedCombination || isSelectedInCurrentRow;
    })
    : [];

  const dispatch = useDispatch();
  const loadingState = useSelector(
    (state) => state.campaignManagement.loadingStates[rowId],
  );
  const error = useSelector((state) => state.campaignManagement.errors[rowId]);

  const handleRefresh = () => {
    dispatch(fetchFiguresForRow(rowId));
  };

  const handleThirdDropdownChange = (value) => {
    handleDropdownChange(rowId, "third", value);

    dispatch(fetchFiguresForRow(rowId, value));
  };

  return (
    <React.Fragment>
      <div className="col-12 col-lg-3">
        <div className="mb-4 col-6 col-lg-12">
          <StyledSelect
            data={Object.keys(dropdownData).map((option) => ({
              value: option,
              label: typeof option === "string" ? option : null,
            }))}
            searchable
            value={row.first}
            placeholder="Select Information Type"
            onChange={(value) => handleDropdownChange(rowId, "first", value)}
          />
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="mb-4 col-6 col-lg-12">
          <StyledSelect
            data={secondDropdownOptions.map((option) => ({
              value: option,
              label: typeof option === "string" ? option : null,
            }))}
            searchable
            value={row.second}
            placeholder="Select Category"
            onChange={(value) => handleDropdownChange(rowId, "second", value)}
          />
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="mb-4 col-6 col-lg-12">
          <StyledSelect
            data={thirdDropdownOptions.map((option) =>
              typeof option === "string"
                ? { value: option, label: option }
                : option,
            )}
            searchable
            value={row.third}
            placeholder="Select Sub-category"
            onChange={handleThirdDropdownChange}
          />
        </div>
      </div>
      <div className="col-12 col-lg-1">
        <ActionIcon
          onClick={() => deleteRow(rowId)}
          color="red"
          variant="subtle"
          size={"sm"}
        >
          <IconTrash />
        </ActionIcon>
      </div>
      <div className="col-12 col-lg-2">
        {loadingState === "loading" && <Loader type={"dots"} color="#0d5ff9" />}
        {loadingState === "error" && (
          <Flex>
            <ActionIcon c={"red"}>
              <IconExclamationMark />
            </ActionIcon>
            <ActionIcon c={"#0d5ff9"} onClick={handleRefresh}>
              <IconRefresh />
            </ActionIcon>
          </Flex>
        )}
        {loadingState !== "loading" && loadingState !== "error" && (
          <>
            <Flex>
              <ActionIcon>{figures !== null ? figures : "-"}</ActionIcon>
              <ActionIcon c={"#0d5ff9"} onClick={handleRefresh}>
                <IconRefresh />
              </ActionIcon>
            </Flex>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DropdownRow;
