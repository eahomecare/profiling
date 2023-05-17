import { Grid } from '@mantine/core'
import assets from './assets'
import { StatsCard } from './StatCard'

const Profiling = () => {

    const assetList = Object.entries(assets)
    const stats = assetList.map((list) => {
        const title = list[0]
        const url = list[1]
        function getCustomerStats() {
            const frequency = Math.floor(Math.random() * 16); // A random frequency per month between 0 and 15
            const maxLastUpdated = Math.floor((1 - frequency / 15) * 30);
            const lastUpdated = Math.floor(Math.random() * (maxLastUpdated + 1)); // A random value between 0 and maxLastUpdated, representing the number of days ago
            const maxCompleted = Math.min(Math.floor((30 - lastUpdated) * (frequency / 30) * 100), 100);
            const percentageCompleted = Math.floor(Math.random() * (maxCompleted + 1)); // A random percentage between 0 and maxCompleted

            return [frequency, percentageCompleted, lastUpdated];
        }

        const customerStats = getCustomerStats();
        console.log(customerStats);
        if (customerStats[1] > 50)
            return (<>
                <Grid.Col span={4}>
                    <StatsCard title={title} url={url} percentage={customerStats[1]} frequency={customerStats[0]} lastUpdated={customerStats[2]} />
                </Grid.Col>
            </>)
        else
            return null
    })
    return (
        <>
            <Grid gutter="xl">
                {stats}
            </Grid>
        </>
    )
}

export default Profiling