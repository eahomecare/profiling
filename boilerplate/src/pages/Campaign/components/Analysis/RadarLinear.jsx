import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
    { count: 120, subject: 'EZ-Auto' },
    { count: 98, subject: 'Cyberior' },
    { count: 86, subject: 'Homecare' },
    { count: 99, subject: 'E-Portal 2.0' },
    { count: 85, subject: 'EZ-Travel' },
];
const updatedData = data.map(item => ({
    ...item,
    subject: `${item.subject} \n ${item.count}`
}));

const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;
    const text = payload.value.split('\n');

    return (
        <g transform={`translate(${x},${y})`}>
            {text.map((value, index) => (
                <text key={index} x={0} y={index * 5} dy={index === 0 ? -5 : 5} textAnchor="middle" fill="#666">
                    {value}
                </text>
            ))}
        </g>
    );
};

export default class Example extends PureComponent {

    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={updatedData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={<CustomizedAxisTick />} />
                    <Radar name="Customer Campaign" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        );
    }
}