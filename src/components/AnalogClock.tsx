// AnalogClock.tsx

import React from 'react';

interface AnalogClockProps {
  timeLeft: number;
  totalTime: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ timeLeft, totalTime }) => {
  const radius = 50;
  const strokeWidth = 8;
  const center = radius;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const elapsedTime = totalTime - timeLeft;
  const elapsedAngle = (elapsedTime / totalTime) * 360;
  const dashOffset = ((totalTime - elapsedTime) / totalTime) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        cx={center}
        cy={center}
        r={radius - strokeWidth / 2}
        fill="#800080"
        stroke="white"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius - strokeWidth / 2}
        fill="none"
        stroke="red"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <line
        x1={center}
        y1={center}
        x2={center + (radius - strokeWidth - 10) * Math.sin(elapsedAngle * Math.PI / 180)}
        y2={center - (radius - strokeWidth - 10) * Math.cos(elapsedAngle * Math.PI / 180)}
        stroke="black"
        strokeWidth="4"
      />
      <circle
        cx={center}
        cy={center}
        r="4"
        fill="black"
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
        {timeLeft}
      </text>
    </svg>
  );
};