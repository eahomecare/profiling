import ReCAPTCHA from "react-google-recaptcha";

const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const Recaptcha = () => {
  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <div>
      <ReCAPTCHA sitekey={TEST_SITE_KEY} onChange={handleCaptchaChange} />
    </div>
  );
};

export default Recaptcha;
