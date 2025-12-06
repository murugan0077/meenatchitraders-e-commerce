import React from 'react';

const LogoGold: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={className}
        fill="none"
    >
        <circle cx="50" cy="50" r="48" stroke="#D4AF37" strokeWidth="2" fill="transparent" />
        <text
            x="50"
            y="65"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="50"
            fontWeight="bold"
            fill="#D4AF37"
        >
            MT
        </text>
    </svg>
);

export default LogoGold;
