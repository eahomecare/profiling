import DOMPurify from "dompurify";
import './Step2.css'
import { Whatsapp } from "./Whatsapp";
import { Box, Center, Transition, Button } from "@mantine/core";
import { useState } from 'react';

const Preview = ({ content, tab }) => {
    const sanitizedContent = DOMPurify.sanitize(content);

    const previewStyles = {
        overflow: 'auto',
        maxHeight: '100%',
    };

    switch (tab) {
        case 'Email':
            return (
                <div style={previewStyles} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            );

        case 'SMS':
            return (
                <div style={previewStyles} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            );

        case 'Notification':
            return (
                <div style={previewStyles} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            );

        case 'Whatsapp':
            return (
                <>
                    <Box style={previewStyles}>
                        <Center >
                            <div style={{ zoom: '200%' }}>
                                <Whatsapp previewStyles={previewStyles} sanitizedContent={sanitizedContent} />
                            </div>
                        </Center>
                    </Box>
                </>
            );

        default:
            return null;
    }
};

export default Preview;