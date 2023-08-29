import React from 'react';
import { useSelector } from 'react-redux';
import { selectRadarData } from '../../../../redux/campaignManagementSlice';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const RadarLinear = () => {
    const radarData = useSelector(selectRadarData);

    const updatedData = radarData.map(item => ({
        ...item,
        subject: `${item.subject} \n ${item.count}`,
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

export default RadarLinear;