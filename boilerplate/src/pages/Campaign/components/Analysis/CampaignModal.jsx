import { useDispatch, useSelector } from "react-redux";
import Step1 from './Step1';
import Step2 from './Step2';
import { Button, Center, Modal } from "@mantine/core";
import './CampaignModal.css'
import { toggleModal, setStep, setEventName, createCampaign } from "../../../../redux/campaignManagementSlice";
import { IconArrowLeft } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

const CampaignModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, eventName, step } = useSelector(state => state.campaignManagement);
    const campaignManagementState = useSelector(state => state.campaignManagement);
    console.log('Request', campaignManagementState)

    const handlePublish = () => {
        dispatch(createCampaign())
            .then(res => {
                if (createCampaign.fulfilled.match(res)) {
                    showNotification({
                        type: 'default',
                        title: `Campaign Published`,
                        message: `The campaign has been published successfully`,
                        color: 'green'
                    });
                    dispatch(toggleModal(false));
                } else {
                    showNotification({
                        type: 'error',
                        title: `Campaign Failed`,
                        message: res.error.message,
                        color: 'red'
                    });
                }
            });
    };

    const handleClose = () => {
        showNotification({
            type: 'default',
            title: `Campaign ${campaignManagementState.eventName} has been Cancelled`,
            message: `Click Run campaign to run the campaign again`,
        });
        dispatch(toggleModal(false));
    };

    const handleNext = () => {
        if (!eventName.trim()) {
            showNotification({
                type: 'warning',
                title: `Please provide an event name`,
                message: `Event name is required to proceed.`,
            });
        } else {
            dispatch(setStep(2));
        }
    };

    return (
        <Modal
            opened={isModalOpen}
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
                    <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
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

                <div className="">
                    {step === 1 ? (
                        <Center>
                            <Button
                                bg={'#524EE1'}
                                sx={{ '&:hover': { backgroundColor: 'white', color: '#524EE1' }, }}
                                onClick={handleNext}>
                                Next
                            </Button>
                        </Center>
                    ) : (
                        <Center>
                            <Button
                                bg={'#524EE1'}
                                sx={{ '&:hover': { backgroundColor: 'white', color: '#524EE1' }, }}
                                onClick={handlePublish}>
                                Publish
                            </Button>
                        </Center>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CampaignModal;