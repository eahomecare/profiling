import { useDispatch, useSelector } from 'react-redux';
import { setRadarData, selectRadarData } from '../../../../redux/campaignManagementSlice';
import RadarLinear from './RadarLinear';
import ButtonGroup from './ButtonGroup';

const Demographic = () => {
    const dispatch = useDispatch();
    const radarData = useSelector(selectRadarData);

    const totalCount = radarData.reduce((acc, curr) => acc + curr.count, 0);

    const handleDownload = () => {
        const baseTotal = 18247000;
        const randomAdjustment = Math.floor(Math.random() * 2000001) - 1000000;
        const desiredTotal = baseTotal + randomAdjustment;

        let randomizedData = radarData.map(item => {
            let randomCount = Math.floor(Math.random() * desiredTotal * 0.25);
            return { ...item, count: randomCount };
        });

        // Adjusting the values to ensure the total is close to the desired value
        const currentTotal = randomizedData.reduce((acc, curr) => acc + curr.count, 0);
        const difference = desiredTotal - currentTotal;
        if (difference !== 0) {
            randomizedData[0].count += difference;
        }

        dispatch(setRadarData(randomizedData));
    };

    return (
        <div className='col-12 col-lg-4'>
            <div className='dem-grapic clearfix'>
                <div className='dem-title mb-4'>
                    <h1>Total Demographic</h1>
                </div>
                <div className='fullwidth mb-2 mt-5'>
                    <RadarLinear />
                </div>
                <div className='row mt-2'>
                    <div className='col-12 col-lg-12 text-center mb-2'>
                        <span className='total-numb pe-2'>
                            {/* {totalCount.toLocaleString('en-IN')} */}
                        </span>
                        <span className='total-users'> Users matching your criteria</span>
                    </div>
                    {/* <div className='col-12 col-lg-6 web-mb-20'>
                        <button type='button' className='btn datebtn' onClick={handleDownload}>Download Data</button>

                    </div>
                    <div className='col-12 col-lg-6'>
                        <button type='button' className='btn runcamp'>Run Campaing</button>

                    </div> */}
                    <ButtonGroup />
                </div>
            </div>
        </div>
    );
};

export default Demographic;