import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../../../redux/campaignManagementSlice';

const FileUploader = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector(state => state.campaignManagement.activeTab);
    const tabData = useSelector(state => state.campaignManagement.tabData);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/plain") {
            const fileContent = await file.text();

            const updatedTabData = {
                ...tabData,
                [activeTab]: {
                    ...tabData[activeTab],
                    content: fileContent,
                    file
                }
            };
            dispatch(updateTabData(updatedTabData));
        } else {
            alert("Please select a valid .txt file");
        }
    };

    return (
        <div className="mb-15">
            <input type="file" accept=".txt" onChange={handleFileChange} />
        </div>
    );
};

export default FileUploader;