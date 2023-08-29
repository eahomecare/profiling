import { useDispatch, useSelector } from 'react-redux';
import CampaignModal from './CampaignModal';
import { resetModal, fetchRowData } from '../../../../redux/campaignManagementSlice';
import { showNotification } from '@mantine/notifications';

const ButtonGroup = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();
    const downloadDataStatus = useSelector(state => state.campaignManagement.downloadDataStatus);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        dispatch(resetModal());
    };

    const handleDownloadData = () => {
        dispatch(fetchRowData());
        if (downloadDataStatus === 'loading') {
            showNotification({
                title: `Fetching Datasets`,
                message: `Please wait while the data is being fetched`,
                color: 'blue'
            });
        } else if (downloadDataStatus === 'success') {
            showNotification({
                title: `Success!`,
                message: `Data fetched successfully!`,
                color: 'green',
            });
        } else if (downloadDataStatus === 'failed') {
            showNotification({
                title: `Error!`,
                message: `Failed to fetch data. Please try again.`,
                color: 'red',
            });
        }
    };

    return (
        <div className='row web-pt-0 pt-5 web-mb-25'>
            <div className='col-12 col-lg-6 web-mb-20'>
                <button
                    type='button'
                    className='btn datebtn'
                    onClick={handleDownloadData}
                >
                    Download Data
                </button>
            </div>
            <div className='col-12 col-lg-6'>
                <button
                    type='button'
                    className='btn runcamp'
                    onClick={handleOpenModal}
                >
                    Run Campaign
                </button>
                {isModalOpen && <CampaignModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />}
            </div>
        </div>
    );
};

export default ButtonGroup;