import { Button, Center, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCampaign,
  setEventName,
  setStep,
  toggleModal,
} from "../../../../redux/campaignManagementSlice";
import StyledButton from "../../../../StyledComponents/StyledButton";
import "./CampaignModal.css";
import Step1 from "./Step1";
import Step2 from "./Step2";

const CampaignModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, eventName, step } = useSelector(
    (state) => state.campaignManagement,
  );
  const campaignManagementState = useSelector(
    (state) => state.campaignManagement,
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePublish = () => {
    dispatch(createCampaign()).then((res) => {
      if (createCampaign.fulfilled.match(res)) {
        showNotification({
          type: "default",
          title: `Campaign Published`,
          message: `The campaign has been published successfully`,
          color: "green",
        });
        dispatch(toggleModal(false));
      } else {
        showNotification({
          type: "error",
          title: `Campaign Failed`,
          message: res.error.message,
          color: "red",
        });
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    showNotification({
      type: "default",
      title: `Campaign ${campaignManagementState.eventName} has been Cancelled`,
      message: `Click Run campaign to run the campaign again`,
    });
    dispatch(toggleModal(false));
  };

  const handleNext = () => {
    if (!eventName.trim()) {
      showNotification({
        type: "warning",
        title: `Please provide an event name`,
        message: `Event name is required to proceed.`,
      });
    } else {
      dispatch(setStep(2));
    }
  };

  const handlePublishConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleConfirmedPublish = () => {
    setLoading(true);
    // setShowConfirmation(false);
    handlePublish();
  };

  return (
    <>
      <Modal
        opened={isModalOpen}
        withCloseButton={false}
        closeOnClickOutside={false}
        size={"xl"}
        styles={{ content: { overflow: "visible" } }}
      >
        <div className="modal-header modal-header-wrap">
          <div className="modeltitle">
            <h1>{step === 1 ? "Create a new Campaign" : "Preview Campaign"}</h1>
            <h2>Step: {step}/2</h2>
            {step === 2 && (
              <IconArrowLeft
                cursor={"pointer"}
                onClick={() => dispatch(setStep(1))}
              />
            )}
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Close"
          ></button>
        </div>

        <div>
          {step === 1 ? (
            <Step1
              eventName={eventName}
              setEventName={(event) => dispatch(setEventName(event))}
            />
          ) : (
            <div>
              <Step2 />
            </div>
          )}
        </div>

        <div>
          {step === 1 ? (
            <Center>
              <StyledButton w={"30%"} onClick={handleNext}>
                Next
              </StyledButton>
            </Center>
          ) : (
            <Center>
              <StyledButton w={"30%"} onClick={handlePublishConfirmation}>
                Publish
              </StyledButton>
            </Center>
          )}
        </div>
      </Modal>

      <Modal
        opened={showConfirmation}
        withCloseButton={true}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Campaign Publish"
        size={"md"}
      >
        <p>Are you sure you want to publish this campaign?</p>
        <Center>
          <StyledButton onClick={handleConfirmedPublish} disabled={loading}>
            {loading ? "Publishing..." : "Yes, Publish"}
          </StyledButton>
          <StyledButton
            variant="outline"
            onClick={() => setShowConfirmation(false)}
          >
            No, Go back
          </StyledButton>
        </Center>
      </Modal>
    </>
  );
};

export default CampaignModal;
