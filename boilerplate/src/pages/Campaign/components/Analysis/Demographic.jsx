import RadarLinear from './RadarLinear'

const Demographic = () => {

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
                        <span className='total-numb pe-2'>18,24,7,000</span>
                        <span className='total-users'> Users matching your criteria</span>
                    </div>
                    <div className='col-12 col-lg-6 web-mb-20'>
                        <button type='button' className='btn datebtn'>Download Data</button>
                    </div>
                    <div className='col-12 col-lg-6'>
                        <button type='button' className='btn runcamp'>Run Campaing</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Demographic