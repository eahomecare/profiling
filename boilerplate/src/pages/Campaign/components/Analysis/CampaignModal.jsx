import { useDispatch, useSelector } from "react-redux";
import Step1 from './Step1';
import Step2 from './Step2';
import { Modal } from "@mantine/core";
import './CampaignModal.css'
import { toggleModal, setStep, setCampaignName, setEventName } from "../../../../redux/campaignManagementSlice";

const CampaignModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, campaignName, eventName, step } = useSelector(state => state.campaignManagement);
    const campaignManagementState = useSelector(state => state.campaignManagement);

    const handlePublish = () => {
        console.log('Campaign Management Slice', campaignManagementState)
        // Simulate an API request
        new Promise((resolve) => setTimeout(resolve, 1000))
            .then(() => {
                dispatch(toggleModal(false));
            });
    };

    const handleStepChange = (step) => {
        dispatch(setStep(step));
    };

    const handleNameChange = (name) => {
        dispatch(setCampaignName(name));
    };

    const handleEventChange = (event) => {
        dispatch(setEventName(event));
    };

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => dispatch(toggleModal(false))}
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
                    <button type="button" className="btn-close" onClick={() => dispatch(toggleModal(false))} aria-label="Close"></button>
                </div>

                <div >
                    {step === 1 ? (
                        <Step1
                            campaignName={campaignName}
                            setCampaignName={handleNameChange}
                            eventName={eventName}
                            setEventName={handleEventChange}
                        />
                    ) : (
                        <div>
                            <Step2 />
                        </div>
                    )}
                </div>

                <div className="modal-footer text-center dis-initial mb-30">
                    {step === 1 ? (
                        <button className="btn model-submit-btn" onClick={() => handleStepChange(2)}>Submit</button>
                    ) : (
                        <button className="btn model-submit-btn" onClick={handlePublish}>Publish</button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CampaignModal;