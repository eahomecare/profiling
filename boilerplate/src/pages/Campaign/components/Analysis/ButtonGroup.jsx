import { useDispatch, useSelector } from 'react-redux';
import CampaignModal from './CampaignModal';
import { resetModal, fetchRowData, toggleModal } from '../../../../redux/campaignManagementSlice';
import { showNotification } from '@mantine/notifications';

const ButtonGroup = () => {
    const dispatch = useDispatch();
    const downloadDataStatus = useSelector(state => state.campaignManagement.downloadDataStatus);
    const isModalOpen = useSelector(state => state.campaignManagement.isModalOpen);
    const allCustomerIDs = useSelector(state => state.campaignManagement.allCustomerIDs); // <-- Add this line

    const handleOpenModal = () => {
        if (allCustomerIDs.length === 0) {
            showNotification({
                title: `Error!`,
                message: `No customers have been selected. Please ensure atleast one customer`,
                color: 'red'
            });
            return;
        }
        dispatch(toggleModal(true));
        dispatch(resetModal());
        showNotification({
            title: `Success!`,
            message: `Campaign initiated against customers in pool.`,
            color: 'green',
        });
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
                {isModalOpen && <CampaignModal isOpen={isModalOpen} closeModal={() => toggleModal(false)} />}
            </div>
        </div>
    );
};

export default ButtonGroup;