import React, { useEffect, useRef } from 'react';
import { Box, Paper, Text } from '@mantine/core';

interface BMISpeedometerProps {
    bmi: number;
}

const BMISpeedometer: React.FC<BMISpeedometerProps> = ({ bmi }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = centerY * 0.9;
        const innerRadius = centerY * 0.7;

        const drawArrow = (angle: number, color: string) => {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(Math.PI - angle);
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(0, centerY * 0.8);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const drawSectionLabel = (angle: number, text: string) => {
            const radius = (outerRadius + innerRadius) / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY - radius * Math.sin(angle);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        };

        const calculateArrowAngle = (bmi: number) => {
            if (bmi <= 18.5) {
                return (bmi * 180) / 180.5;
            } else if (bmi <= 24.9) {
                return ((bmi - 18.5) * 180) / 180.5;
            } else if (bmi <= 29.9) {
                return ((bmi - 24.9) * 180) / 180.5;
            } else {
                return ((bmi - 29.9) * 180) / 180.5;
            }
        };

        const angle = calculateArrowAngle(bmi);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw sections
        const sectionAngles = [0, 45, 90, 135, 180];
        const sectionLabels = ['Underweight', 'Normal', 'Overweight', 'Obesity'];
        const sectionColors = ['#28a745', '#ffc107', '#ff7f00', '#dc3545'];

        sectionAngles.forEach((startAngle, index) => {
            if (index === sectionLabels.length) return;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, Math.PI + (Math.PI * startAngle) / 180, Math.PI + (Math.PI * sectionAngles[index + 1]) / 180, false);
            ctx.arc(centerX, centerY, innerRadius, Math.PI + (Math.PI * sectionAngles[index + 1]) / 180, Math.PI + (Math.PI * startAngle) / 180, true);
            ctx.closePath();
            ctx.fillStyle = sectionColors[index];
            ctx.fill();
        });

        // Draw section labels
        const sectionLabelAngles = sectionAngles.slice(0, -1).map((angle, index) => {
            return (Math.PI * (angle + (sectionAngles[index + 1] - angle) / 2 + 90)) / 180;
        });

        const drawCurvedText = (text: string, radius: number, startAngle: number, fontSize: number = 12) => {
            const textWidth = ctx.measureText(text).width;
            const textLength = text.length;
            const angleIncrement = textWidth / textLength / radius;

            ctx.fillStyle = '#000'; // Set text color to black
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle - angleIncrement * textLength / 2);

            for (let i = 0; i < textLength; i++) {
                const char = text.charAt(i);
                const charWidth = ctx.measureText(char).width;
                ctx.rotate(angleIncrement);
                ctx.save();
                ctx.translate(0, -radius);
                ctx.fillText(char, -charWidth / 2, 0);
                ctx.restore();
            }

            ctx.restore();
        };

        sectionLabelAngles.reverse().forEach((angle, index) => {
            const radius = (outerRadius + outerRadius * 1.1) / 2;
            drawCurvedText(sectionLabels[index], radius, Math.PI - angle);
        });

        // Draw arrow
        drawArrow((Math.PI * angle) / 180, '#000');

    }, [bmi]);

    return (
        <Box>
            <Text fz={'sm'} c='dimmed'>BMI category</Text>
            <canvas ref={canvasRef} width="300" height="150" />
        </Box>
    );
};

export default BMISpeedometer;