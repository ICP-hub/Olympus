import React, { useEffect, useState } from 'react';

const CustomCaptcha = ({ text }) => {
    const [captchaSvg, setCaptchaSvg] = useState('');

    useEffect(() => {
        if (typeof text === 'string' && text.length > 0) {
            // Adjust font size and y-coordinate for reduced height
            const fontSize = 20;
            const baseY = 40; // Base y position for the text
            const letters = text.split('').map((char, index) => {
                const x = 20 + index * 30 + Math.random() * 10; // Random x position
                const y = baseY + Math.random() * 10 - 5; // Random y position
                const rotate = Math.random() * 30 - 15; // Random rotation
                return `<text x="${x}" y="${y}" transform="rotate(${rotate}, ${x}, ${y})" font-size="${fontSize}" fill="#000" font-family="Arial">${char}</text>`;
            }).join('');

            // Add random lines for noise
            const lines = Array.from({ length: 5 }).map(() => {
                const x1 = Math.random() * 200;
                const y1 = Math.random() * 60; // Adjust y1 range
                const x2 = Math.random() * 200;
                const y2 = Math.random() * 60; // Adjust y2 range
                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="2" />`;
            }).join('');

            const svg = `
                <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="60" fill="#f5f5f5" />
                    ${letters}
                    ${lines}
                </svg>
            `;
            setCaptchaSvg(svg);
        } else {
            console.error("Invalid text input: Expected a non-empty string");
        }
    }, [text]);

    return (
        <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
    );
};

export default CustomCaptcha;
