import React from 'react';
import PropTypes from 'prop-types';

const CenteredIframe = () => {
    const url = `/agent?mobileNo=7978341669&agentAuthorizationToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudEF1dGhlbnRpY2F0aW9uS2V5IjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SkpSQ0k2SW1GblpXNTBMVGMzTnlJc0ltNWhiV1VpT2lKQloyVnVkQ0JUYldsMGFDSXNJbVZ0WVdsc0lqb2laRzkxWW14bFlXZGxiblF3TURGQWJXRjBjbWw0TG1OdmJTSXNJbTF2WW1sc1pTSTZJamt3T1RBNU1Ea3dPVEFpTENKemRHRjBhV05MWlhraU9pSnVZbXBHY1hCMFNUVXJVak1yVUZKYU5YcHRObFpuWjNCaWFFMHZUWEVyTlZaTFRtSk9VVkE1UVV4dlBTSXNJbU55YlU1aGJXVWlPaUpJUXlJc0ltbGhkQ0k2TVRZNU1EZ3dOVEUwTVgwLl91WXhKekZvdWtaTWExSkM5RXU0VzJOMHRTMUVXYkJ2Uk02ZURHSlM5VjgiLCJyYW5kb21WYWx1ZSI6Ijg1NGJjZTBmNjUyZDlhODg2YTU0MTQ4MTNjNGUxNWNiIiwiaWF0IjoxNjkwODEwMzk3fQ.mn_YUePplOn1VFZR832Ob__rkJ2GRK4xDUvszkekcU8`
    const iframeStyle: React.CSSProperties = {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80%',
        height: '80%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
    };

    return <iframe src={url} title="Centered Iframe" style={iframeStyle} />;
};

CenteredIframe.propTypes = {
    url: PropTypes.string.isRequired,
};

export default CenteredIframe;