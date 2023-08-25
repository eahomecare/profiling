import React from "react";
import { TextInput } from "@mantine/core";

const Step1 = ({ campaignName, setCampaignName, eventName, setEventName }) => {
    return (
        <>
            <div className='mb-30'>
                <TextInput
                    id="campaignName"
                    name="campaignName"
                    placeholder="Campaign Name"
                    className="custom-class inputs-control"
                    type="text"
                    value={campaignName}
                    onChange={evt => setCampaignName(evt.currentTarget.value)}
                />
            </div>
            <div className='mb-30'>
                <TextInput
                    id="eventName"
                    name="eventName"
                    placeholder="Event Name"
                    className="custom-class inputs-control"
                    type="text"
                    value={eventName}
                    onChange={evt => setEventName(evt.currentTarget.value)}
                />
            </div>
        </>
    );
};

export default Step1;