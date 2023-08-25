import React, { useState } from "react";
import Step1 from './Step1';
import Step2 from './Step2';
import Timeline from "./Timeline";
import { Modal } from "@mantine/core";
import './CampaignModal.css'

const CampaignModal = ({ isOpen, closeModal }) => {
    const [campaignName, setCampaignName] = useState("");
    const [eventName, setEventName] = useState("");
    const [step, setStep] = useState(1);

    const handlePublish = () => {
        // Simulate an API request
        new Promise((resolve) => setTimeout(resolve, 1000))
            .then(() => {
                closeModal();
            });
    };

    return (
        <Modal
            opened={isOpen}
            onClose={closeModal}
            withCloseButton={false}
            closeOnClickOutside={false}
            size={'xl'}
        >
            <div>
                <div className="modal-header modal-header-wrap">
                    <div className='modeltitle'>
                        <h1>{step === 1 ? "Create a new Campaign" : "Preview Campaign"}</h1>
                        <h2>Step: {step}/2</h2>
                    </div>
                    <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>

                <div >
                    {step === 1 ? (
                        <Step1
                            campaignName={campaignName}
                            setCampaignName={setCampaignName}
                            eventName={eventName}
                            setEventName={setEventName}
                        />
                    ) : (
                        <div>
                            <Step2 />
                        </div>
                    )}
                </div>

                <div className="modal-footer text-center dis-initial mb-30">
                    {step === 1 ? (
                        <button className="btn model-submit-btn" onClick={() => setStep(2)}>Submit</button>
                    ) : (
                        <button className="btn model-submit-btn" onClick={handlePublish}>Publish</button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CampaignModal;