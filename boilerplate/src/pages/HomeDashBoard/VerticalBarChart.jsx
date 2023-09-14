import { Box, Center } from "@mantine/core";
import React from "react";
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
            Contactability: 250,
            Interested: 120,
            Converted: 75,
            Over: 55
        },
        {
            name: "Email",
            Contactability: 180,
            Interested: 90,
            Converted: 40,
            Over: 20
        },
        {
            name: "Notification",
            Contactability: 230,
            Interested: 110,
            Converted: 50,
            Over: 30
        },
        {
            name: "Whatsapp",
            Contactability: 275,
            Interested: 135,
            Converted: 85,
            Over: 60
        },
    ];

    return (
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
                        <Bar dataKey="Contactability" fill="#82ca9d" stackId="a">
                        </Bar>
                        <Bar dataKey="Interested" fill="#8884d8" stackId="a">
                        </Bar>
                        <Bar dataKey="Converted" fill="#883538" stackId="a">
                        </Bar>
                        <Bar dataKey="Over" fill="#8334f8" stackId="a">
                            <LabelList
                                position="right"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Center>
    );
}

export default VerticalBarChart;