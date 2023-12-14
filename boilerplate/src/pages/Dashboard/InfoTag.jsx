import { Text } from '@mantine/core';
import React from 'react';

const InfoTag = ({ title, subject }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "-10px" }}>
            <Text fz={'sm'} c='dimmed' style={{ alignSelf: "start" }}>{title}</Text>
            <Text style={{ alignSelf: "end" }}>{subject}</Text>
        </div>
    );
};

export default InfoTag;
