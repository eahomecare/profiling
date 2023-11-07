import { useDispatch, useSelector } from "react-redux";
import Timeline from "./Timeline";
import FileUploader from "./FileUploader";
import {
  setActiveTab,
  updateTabData,
} from "../../../../redux/campaignManagementSlice";
import { useState } from "react";
import { Box, Button, Flex, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import WysiwygEditor from "./WysiwygEditor";
import Preview from "./Preview";
import "./Step2.css";
import StyledButton from "../../../../StyledComponents/StyledButton";

const Step2 = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.campaignManagement.activeTab);
  const tabData = useSelector((state) => state.campaignManagement.tabData);
  const [previewMode, setPreviewMode] = useState(false);

  const enterPreviewMode = () => {
    setPreviewMode(true);
  };

  const exitPreviewMode = () => {
    setPreviewMode(false);
  };

  const handleTextInputWysiwyg = (content) => {
    const updatedTabData = {
      ...tabData,
      [activeTab]: {
        ...tabData[activeTab],
        content: content,
        characterCount: content.length,
      },
    };
    dispatch(updateTabData(updatedTabData));
  };

  const handleTimelineUpdate = (newState) => {
    const updatedTabData = {
      ...tabData,
      [activeTab]: {
        ...tabData[activeTab],
        timelineState: newState,
      },
    };
    console.log("updatedTabData", updateTabData);
    dispatch(updateTabData(updatedTabData));
  };

  const handleApplyForAll = (currentTimelineState) => {
    const updatedTabData = { ...tabData };
    ["Email", "SMS", "Notification", "Whatsapp"].forEach((tab) => {
      updatedTabData[tab] = {
        ...tabData[tab],
        timelineState: currentTimelineState,
      };
    });
    dispatch(updateTabData(updatedTabData));
    showNotification({
      type: "default",
      title: "Timelines applied",
      message: "Timelines have been added for all modes",
    });
  };

  return (
    <>
      {previewMode && <div className="overlay"></div>}
      <div className={`modal-body modal-pad`}>
        <div>
          <div className="row">
            <div className="col-md-2">
              <div
                className="dis-block nav-pills me-3"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                {["Email", "SMS", "Notification", "Whatsapp"].map((tab) =>
                  previewMode ? (
                    <Box ml={-15}>
                      <Button
                        className="preview-container"
                        key={tab}
                        onClick={() => dispatch(setActiveTab(tab))}
                        c={activeTab === tab ? "#0d5ff9" : "white"}
                        bg={activeTab === tab ? "white" : "#0d5ff9"}
                        sx={{
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#524EE1",
                          },
                        }}
                        size="lg"
                        fullWidth
                        style={{ marginBottom: "10px" }}
                      >
                        <Text size={"xs"}>{tab}</Text>
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      className="preview-container"
                      key={tab}
                      onClick={() => dispatch(setActiveTab(tab))}
                      c={activeTab === tab ? "#white" : "#0d5ff9"}
                      bg={activeTab === tab ? "#0d5ff9" : "white"}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F3F6FF",
                          color: "#0d5ff9",
                        },
                      }}
                      mr={-5}
                      size="lg"
                      fullWidth
                      style={{ marginBottom: "10px" }}
                    >
                      <Text size={"xs"}>{tab}</Text>
                    </Button>
                  ),
                )}
              </div>
            </div>

            <div className="col-md-10">
              <div className="preview-container tab-content tab-content-bg">
                {["Email", "SMS", "Notification", "Whatsapp"].map((tab) => (
                  <div
                    key={tab}
                    className={` tab-pane fade ${activeTab === tab ? "show active" : ""
                      }`}
                    id={`v-pills-${tab}`}
                    role="tabpanel"
                  >
                    <Box>
                      {previewMode ? (
                        <Box h={250}>
                          <Preview content={tabData[tab]?.content} tab={tab} />
                        </Box>
                      ) : (
                        <Box h={290} mt={-40}>
                          <WysiwygEditor
                            key={activeTab}
                            activeTab={activeTab}
                            initialContent={tabData[tab]}
                            onChange={handleTextInputWysiwyg}
                          />
                        </Box>
                      )}
                    </Box>
                    <Flex direction={"row-reverse"} mt={20}>
                      <div className="character-count">
                        {tabData[activeTab].characterCount}/
                        {tabData[activeTab].charLimit}
                      </div>
                      {!previewMode && (
                        <Box ml={5}>
                          {tabData[activeTab].characterCount >
                            tabData[activeTab].charLimit && (
                              <div className="character-limit-error">
                                Character limit exceeded!
                              </div>
                            )}
                        </Box>
                      )}
                    </Flex>
                    <Box mt={"-4%"}>
                      {!previewMode ? (
                        <StyledButton w={120} onClick={enterPreviewMode}>
                          Preview
                        </StyledButton>
                      ) : (
                        <StyledButton w={120} onClick={exitPreviewMode}>
                          OK
                        </StyledButton>
                      )}
                    </Box>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Box className={`${!previewMode ? "tab-preview-container" : ""}`}>
            {!previewMode && (
              <>
                <Flex direction={"row-reverse"} mr={-100} mt={-20}>
                  <FileUploader key={activeTab} />
                </Flex>
                <Timeline
                  key={activeTab}
                  onUpdate={handleTimelineUpdate}
                  onApplyForAll={handleApplyForAll}
                  initialState={tabData[activeTab]?.timelineState || {}}
                />
              </>
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export default Step2;
