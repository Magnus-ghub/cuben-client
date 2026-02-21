import React from 'react';

export const CubenLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="blue9" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style={{ stopColor: '#0052a3', stopOpacity: 1 }} />
				<stop offset="100%" style={{ stopColor: '#003d99', stopOpacity: 1 }} />
			</linearGradient>
		</defs>
		{/* Center hexagon */}
		<polygon points="50,25 65,35 65,55 50,65 35,55 35,35" fill="url(#blue9)" />
		{/* Surrounding hexagons */}
		<polygon points="75,35 90,45 90,65 75,75 60,65 60,45" fill="url(#blue9)" opacity="0.6" stroke="url(#blue9)" strokeWidth="1" />
		<polygon points="25,35 40,45 40,65 25,75 10,65 10,45" fill="url(#blue9)" opacity="0.6" stroke="url(#blue9)" strokeWidth="1" />
		<polygon points="50,75 65,85 65,95 50,95 35,85 35,75" fill="url(#blue9)" opacity="0.6" stroke="url(#blue9)" strokeWidth="1" />
	</svg>
);


export const CubenChatLogo: React.FC = () => (
	<svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="chatCubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style={{ stopColor: '#5DDBF4', stopOpacity: 1 }} />
				<stop offset="50%" style={{ stopColor: '#7B9FF5', stopOpacity: 1 }} />
				<stop offset="100%" style={{ stopColor: '#9B7FED', stopOpacity: 1 }} />
			</linearGradient>
		</defs>
		<path
			d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z"
			fill="none"
			stroke="url(#chatCubeGradient)"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path d="M 50 15 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
		<path d="M 15 35 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
		<path d="M 85 35 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
	</svg>
);