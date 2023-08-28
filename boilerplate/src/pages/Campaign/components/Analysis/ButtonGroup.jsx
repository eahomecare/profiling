import { useDispatch } from 'react-redux';
import CampaignModal from './CampaignModal';
import { resetModal } from '../../../../redux/campaignManagementSlice'

const ButtonGroup = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        setIsModalOpen(true);
        dispatch(resetModal());
    };
    return (
        <div className='row web-pt-0 pt-5 web-mb-25'>
            <div className='col-12 col-lg-6 web-mb-20'>
                <button type='button' className='btn datebtn'>Download Data</button>
            </div>
            <div className='col-12 col-lg-6'>
                <button type='button' className='btn runcamp' onClick={handleOpenModal}>Run Campaing</button>
                {isModalOpen && <CampaignModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />}
            </div>
        </div>
    );
};

export default ButtonGroup;