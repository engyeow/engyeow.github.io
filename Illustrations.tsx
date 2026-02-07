
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const HoneyPot: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 120 150"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pot body */}
    <path
      d="M25 55
         C25 40 45 32 60 32
         C75 32 95 40 95 55
         V105
         C95 120 78 135 60 135
         C42 135 25 120 25 105
         V55Z"
      fill="#E0A21B"
      stroke="#6D4C41"
      strokeWidth="3"
    />

    {/* Rim */}
    <ellipse
      cx="60"
      cy="38"
      rx="42"
      ry="12"
      fill="#FFD54F"
      stroke="#6D4C41"
      strokeWidth="3"
    />

    {/* Honey drip */}
    <path
      d="M40 38
         C42 48 38 55 42 60
         C46 66 52 60 52 54
         C52 48 50 44 50 38Z"
      fill="#FFECB3"
    />

    {/* Belly line */}
    <path
      d="M35 70C48 74 72 74 85 70"
      stroke="#6D4C41"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Label */}
    <rect
      x="38"
      y="80"
      rx="10"
      ry="10"
      width="44"
      height="26"
      fill="#F5F5DC"
      stroke="#6D4C41"
      strokeWidth="2"
    />

    <text
      x="60"
      y="98"
      textAnchor="middle"
      fill="#6D4C41"
      style={{
        fontSize: "12px",
        fontStyle: "italic",
        fontWeight: 700,
        letterSpacing: "1px",
      }}
    >
      HUNNY
    </text>
  </svg>
);

export const Bee: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 80 60"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wings */}
    <ellipse
      cx="38"
      cy="18"
      rx="12"
      ry="7"
      fill="#E3F2FD"
      stroke="#90CAF9"
      strokeWidth="1.5"
    />
    <ellipse
      cx="50"
      cy="16"
      rx="10"
      ry="6"
      fill="#E3F2FD"
      stroke="#90CAF9"
      strokeWidth="1.5"
    />

    {/* Body */}
    <ellipse
      cx="42"
      cy="34"
      rx="20"
      ry="14"
      fill="#FFEB3B"
      stroke="#5D4037"
      strokeWidth="2"
    />

    {/* Vertical stripes */}
    <path
      d="M34 22V46"
      stroke="#5D4037"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M42 20V48"
      stroke="#5D4037"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M50 22V46"
      stroke="#5D4037"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle
      cx="20"
      cy="32"
      r="10"
      fill="#FFEB3B"
      stroke="#5D4037"
      strokeWidth="2"
    />

    {/* Eye */}
    <circle cx="18" cy="30" r="2" fill="#3E2723" />

    {/* Smile */}
    <path
      d="M16 34C17.5 36 20.5 36 22 34"
      stroke="#3E2723"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Blush */}
    <circle cx="16" cy="34" r="2" fill="#F8BBD0" opacity="0.7" />

    {/* Antenna */}
    <path
      d="M16 18C12 12 8 14 10 18"
      stroke="#5D4037"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Stinger */}
    <path
      d="M64 34L72 32L64 30Z"
      fill="#5D4037"
    />
  </svg>
);

export const Flower: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 80 80"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer petals */}
    {[...Array(12)].map((_, i) => (
      <ellipse
        key={`outer-${i}`}
        cx="40"
        cy="16"
        rx="7"
        ry="16"
        fill="#FBC02D"
        stroke="#F9A825"
        strokeWidth="1.2"
        transform={`rotate(${i * 30} 40 40)`}
      />
    ))}

    {/* Inner petals */}
    {[...Array(12)].map((_, i) => (
      <ellipse
        key={`inner-${i}`}
        cx="40"
        cy="20"
        rx="5"
        ry="12"
        fill="#FFEE58"
        stroke="#FBC02D"
        strokeWidth="1"
        transform={`rotate(${i * 30 + 15} 40 40)`}
      />
    ))}

    {/* Center base */}
    <circle
      cx="40"
      cy="40"
      r="14"
      fill="#8D6E63"
      stroke="#5D4037"
      strokeWidth="2"
    />

    {/* Seed texture dots */}
    {[...Array(20)].map((_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 6 + (i % 3);
      return (
        <circle
          key={`seed-${i}`}
          cx={40 + Math.cos(angle) * radius}
          cy={40 + Math.sin(angle) * radius}
          r="1.2"
          fill="#5D4037"
        />
      );
    })}

    {/* Highlight */}
    <circle
      cx="36"
      cy="36"
      r="4"
      fill="#A1887F"
      opacity="0.4"
    />
  </svg>
);
