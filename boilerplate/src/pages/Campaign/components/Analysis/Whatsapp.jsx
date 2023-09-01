import "./Whatsapp.css";
import eaLogo from '../../../Login/assets/eaLogo.png'

export const Whatsapp = ({ previewStyles, sanitizedContent }) => {
    console.log('Sanitized', sanitizedContent)
    return (
        <div className="europ-assistance">
            <div className="frame">
                <div className="be-a-part-of-IPL-wrapper">
                    <p className="be-a-part-of-IPL" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </div>
                <div className="group">
                    <div className="overlap-group">
                        <div className="div">Book now</div>
                    </div>
                </div>
            </div>
            <div className="overlap">
                <div className="text-wrapper-2">Europ Assistance India</div>
                {/* <img className="arrow" alt="Arrow" src="arrow-3.svg" /> */}
                <div className="img-wrapper">
                    <img className="img" alt="Img" src={eaLogo} />
                </div>
                <div className="div-wrapper">
                    <div className="text-wrapper-3">7:01 PM</div>
                </div>
                <div className="group-2">
                    {/* <img className="heroicons-outline" alt="Heroicons outline" src="heroicons-outline-search.svg" />
                    <img className="eva-video-fill" alt="Eva video fill" src="eva-video-fill.svg" /> */}
                    <div className="three-dots">
                        <div className="ellipse" />
                        <div className="ellipse-2" />
                        <div className="ellipse-3" />
                    </div>
                </div>
            </div>
            <div className="group-3">
                <div className="overlap-2">
                    {/* <img className="ic-baseline-attach" alt="Ic baseline attach" src="ic-baseline-attach-file.svg" />
                    <img className="bx-bxs-camera" alt="Bx bxs camera" src="bx-bxs-camera.svg" />
                    <img className="gg-smile-mouth-open" alt="Gg smile mouth open" src="gg-smile-mouth-open.svg" /> */}
                    <div className="text-wrapper-4">Type a message</div>
                </div>
                <div className="imagevector-wrapper">
                    {/* <img className="imagevector" alt="Imagevector" src="image2vector-17-1.svg" /> */}
                </div>
            </div>
        </div>
    );
};
