import { useDispatch, useSelector } from "react-redux";
import Step1 from './Step1';
import Step2 from './Step2';
import { Modal } from "@mantine/core";
import './CampaignModal.css'
import { toggleModal, setStep, setCampaignName, setEventName } from "../../../../redux/campaignManagementSlice";
import { IconArrowLeft } from "@tabler/icons-react";

const CampaignModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, eventName, step } = useSelector(state => state.campaignManagement);
    const campaignManagementState = useSelector(state => state.campaignManagement);

    const handlePublish = () => {
        console.log('Campaign Management Slice', campaignManagementState);
        // Simulate an API request
        new Promise((resolve) => setTimeout(resolve, 1000))
            .then(() => {
                dispatch(toggleModal(false));
            });
    };

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => {
                dispatch(toggleModal(false));
            }}
            withCloseButton={false}
            closeOnClickOutside={false}
            size={'xl'}
        >
            <div>
                <div className="modal-header modal-header-wrap">
                    <div className='modeltitle'>
                        <h1>{step === 1 ? "Create a new Campaign" : "Preview Campaign"}</h1>
                        <h2>Step: {step}/2</h2>
                        {step === 2 && <IconArrowLeft cursor={'pointer'} onClick={() => dispatch(setStep(1))} />}
                    </div>
                    <button type="button" className="btn-close" onClick={() => dispatch(toggleModal(false))} aria-label="Close"></button>
                </div>

                <div >
                    {step === 1 ? (
                        <Step1
                            eventName={eventName}
                            setEventName={event => dispatch(setEventName(event))}
                        />
                    ) : (
                        <div>
                            <Step2 />
                        </div>
                    )}
                </div>

                <div className="modal-footer text-center dis-initial mb-30">
                    {step === 1 ? (
                        <button className="btn model-submit-btn" onClick={() => dispatch(setStep(2))}>Next</button>
                    ) : (
                        <button className="btn model-submit-btn" onClick={handlePublish}>Publish</button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CampaignModal;