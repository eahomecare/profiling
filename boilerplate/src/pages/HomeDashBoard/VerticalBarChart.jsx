import { ActionIcon, Box, Center, Flex, Select, Stack, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import React from "react";
import { useSelector } from "react-redux";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Label,
    LabelList,
    Legend
} from "recharts";

const renderCustomizedLabel = (props) => {
    const { content, ...rest } = props;
    return <Label {...rest} fontSize="12" fill="#FFFFFF" fontWeight="Bold" />;
};

const VerticalBarChart = () => {
    const data = [
        {
            name: "SMS",
            Delivered: 250,
            Interested: 120,
            Converted: 75,
            Failure: 55
        },
        {
            name: "Email",
            Delivered: 180,
            Interested: 90,
            Converted: 40,
            Failure: 20
        },
        {
            name: "Notification",
            Delivered: 230,
            Interested: 110,
            Converted: 50,
            Failure: 30
        },
        {
            name: "Whatsapp",
            Delivered: 275,
            Interested: 135,
            Converted: 85,
            Failure: 60
        },
    ];

    const campaignNames = useSelector((state) => state.campaign.campaignNames);

    return (
    <Stack>
<Flex justify={'start'}>
                        <Select
                            maw={320}
                            mx="auto"
                            label={<Text c={'dimmed'}>Campaign(s)</Text>}
                            data={['All', ...campaignNames]}
                            transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
                            withinPortal
                            rightSection={<ActionIcon><IconChevronDown /></ActionIcon>}
                        />
</Flex>
        <Center>
            <Box h={400} w={800} p={20} >
                <ResponsiveContainer height={'100%'} width={"100%"}>
                    <BarChart
                        layout="vertical"
                        data={data}
                    >
                        <XAxis label={{ value: 'Campaigns', offset: 0 }} type="number" height={55} />
                        <YAxis
                            label={{ value: 'Communication Formats', angle: -90, position: 'left', offset: '-15' }}
                            type="category"
                            dataKey="name"
                            width={150}
                        />
                        <Tooltip />
                        <Legend iconType='circle' verticalAlign='top' align='right' offset={-10} />
                        <Bar dataKey="Delivered" fill="#82ca9d" stackId="a"/>
                        <Bar dataKey="Failure" fill="#883538" stackId="a"/>
                        <Bar dataKey="Interested" fill="#8884d8" stackId="a"/>
                        <Bar dataKey="Converted" fill="#8334f8"  stackId="a">
                            <LabelList
                                position="right"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Center>
</Stack>
    );
}

export default VerticalBarChart;
