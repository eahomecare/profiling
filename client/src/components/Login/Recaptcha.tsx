import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

// interface RecaptchaProps {
//     sitekey: string;
// }

// const Recaptcha: React.FC<RecaptchaProps> = ({ sitekey=TEST_SITE_KEY }) => {
const Recaptcha: React.FC = () => {
    const handleCaptchaChange = (value: string | null) => {
        console.log('Captcha value:', value);
    };

    return (
        <div>
            <ReCAPTCHA sitekey={TEST_SITE_KEY} onChange={handleCaptchaChange} />
        </div>
    );
};

export default Recaptcha;