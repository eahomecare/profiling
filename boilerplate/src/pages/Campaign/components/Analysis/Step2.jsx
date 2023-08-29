import { useDispatch, useSelector } from "react-redux";
import Timeline from "./Timeline";
import FileUploader from './FileUploader';
import {
    setActiveTab,
    updateTabData
} from '../../../../redux/campaignManagementSlice';
import { useState, useEffect } from "react";
import { Box, Flex } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const Step2 = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector(state => state.campaignManagement.activeTab);
    const tabData = useSelector(state => state.campaignManagement.tabData);
    const [previewMode, setPreviewMode] = useState(false);

    const enterPreviewMode = () => {
        setPreviewMode(true);
    };

    const exitPreviewMode = () => {
        setPreviewMode(false);
    };

    const handleTextInput = (event) => {
        const value = event.target.value;
        const updatedTabData = {
            ...tabData,
            [activeTab]: {
                ...tabData[activeTab],
                content: value,
                characterCount: value.length
            }
        };
        dispatch(updateTabData(updatedTabData));
    };

    const handleTimelineUpdate = (newState) => {
        const updatedTabData = {
            ...tabData,
            [activeTab]: {
                ...tabData[activeTab],
                timelineState: newState
            }
        };
        dispatch(updateTabData(updatedTabData));
    };

    const handleApplyForAll = (currentTimelineState) => {
        const updatedTabData = { ...tabData };
        ['Email', 'SMS', 'Notification', 'Whatsapp'].forEach(tab => {
            updatedTabData[tab] = {
                ...tabData[tab],
                timelineState: currentTimelineState
            };
        });
        dispatch(updateTabData(updatedTabData));
        showNotification({
            type: 'default',
            title: 'Timelines applied',
            message: 'Timelines have been added for all modes',
        })
    };
    return (
        <>
            <div className="modal-body modal-pad">
                <div>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="nav dis-block nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                {['Email', 'SMS', 'Notification', 'Whatsapp'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`nav-link d-block mb-2 ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => dispatch(setActiveTab(tab))}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-10">
                            <div className="tab-content tab-content-bg">
                                {['Email', 'SMS', 'Notification', 'Whatsapp'].map(tab => (
                                    <div
                                        key={tab}
                                        className={`tab-pane fade ${activeTab === tab ? 'show active' : ''}`}
                                        id={`v-pills-${tab}`}
                                        role="tabpanel"
                                    >
                                        <Box>
                                            <textarea
                                                className="full-width-textarea"
                                                value={tabData[tab]?.content || ''}
                                                onChange={handleTextInput}
                                                readOnly={previewMode}  // Set to readonly in preview mode
                                            ></textarea>
                                        </Box>
                                        <Flex direction={"row-reverse"} mt={10}>
                                            <div className="character-count">
                                                {tabData[activeTab].characterCount}/{tabData[activeTab].charLimit}
                                            </div>
                                            {!previewMode && (
                                                <Box ml={5}>
                                                    {tabData[activeTab].characterCount > tabData[activeTab].charLimit &&
                                                        <div className="character-limit-error">Character limit exceeded!</div>
                                                    }
                                                </Box>
                                            )}
                                        </Flex>
                                        <Box>
                                            {!previewMode ? (
                                                <button className="btn model-submit-btn" onClick={enterPreviewMode}>Preview</button>
                                            ) : (
                                                <button className="btn model-submit-btn" onClick={exitPreviewMode}>OK</button>
                                            )}
                                        </Box>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Box >
                        {!previewMode && (
                            <>
                                <Flex direction={'row-reverse'} mr={-100} mt={-20} >
                                    <FileUploader />
                                </Flex>
                                <Timeline
                                    key={activeTab}
                                    onUpdate={handleTimelineUpdate}
                                    onApplyForAll={handleApplyForAll}  // Passing the new function
                                    initialState={tabData[activeTab]?.timelineState || {}}
                                />
                            </>
                        )}
                    </Box>
                </div>
            </div >
        </>
    );
};

export default Step2;