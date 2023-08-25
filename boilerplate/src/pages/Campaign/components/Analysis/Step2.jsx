import React, { useState } from "react";
// import editicon from '../../img/edit-icon.png';
import Timeline from "./Timeline";
import FileUploader from './FileUploader';

const Step2 = () => {
    const [activeTab, setActiveTab] = useState('Email');

    const [tabData, setTabData] = useState({
        Email: {
            content: '',
            timelineState: {},
            file: null
        },
        SMS: {
            content: '',
            timelineState: {},
            file: null
        },
        Notification: {
            content: '',
            timelineState: {},
            file: null
        },
        Whatsapp: {
            content: '',
            timelineState: {},
            file: null
        }
    });

    const handleTextInput = (event) => {
        const value = event.target.value;
        setTabData(prevData => ({
            ...prevData,
            [activeTab]: {
                ...prevData[activeTab],
                content: value
            }
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setTabData(prevData => ({
            ...prevData,
            [activeTab]: {
                ...prevData[activeTab],
                file
            }
        }));
    };

    const handleFileContent = (content) => {
        setTabData(prevData => ({
            ...prevData,
            [activeTab]: {
                ...prevData[activeTab],
                content
            }
        }));
    };

    const handleTimelineUpdate = (newState) => {
        setTabData(prevData => ({
            ...prevData,
            [activeTab]: {
                ...prevData[activeTab],
                timelineState: newState
            }
        }));
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
                                        onClick={() => setActiveTab(tab)}
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
                                                value={tabData[tab].content}
                                                onChange={handleTextInput}
                                            ></textarea>
                                            {/* Uncomment if you need the button */}
                                            {/* <button type='button' className='btn edit-btn'>
                                            <div><img src={editicon} alt="" className='img-fluid' /></div><div className='edit-title'>Edit</div>
                                        </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <FileUploader onFileContent={handleFileContent} />
                        <Timeline
                            key={activeTab}
                            onUpdate={handleTimelineUpdate}
                            initialState={tabData[activeTab].timelineState}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2;