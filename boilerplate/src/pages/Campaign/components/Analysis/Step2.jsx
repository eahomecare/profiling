import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Timeline from "./Timeline";
import FileUploader from './FileUploader';
import {
    setActiveTab,
    updateTabData
} from '../../../../redux/campaignManagementSlice';

const Step2 = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector(state => state.campaignManagement.activeTab);
    const tabData = useSelector(state => state.campaignManagement.tabData);

    const handleTextInput = (event) => {
        const value = event.target.value;
        const updatedTabData = {
            ...tabData,
            [activeTab]: {
                ...tabData[activeTab],
                content: value
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
                                        <div className='clearfix'>
                                            <textarea
                                                className="full-width-textarea"
                                                value={tabData[tab]?.content || ''}
                                                onChange={handleTextInput}
                                            ></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <FileUploader />
                        <Timeline
                            key={activeTab}
                            onUpdate={handleTimelineUpdate}
                            initialState={tabData[activeTab]?.timelineState || {}}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2;