import React from "react";
import { ThreeDots } from "react-loader-spinner";

const CustomCaptcha = ({ text, isCaptchaLoading }) => {
  const [captchaSvg, setCaptchaSvg] = React.useState("");

  React.useEffect(() => {
    if (text && !isCaptchaLoading) {
      generateCaptcha(text);
    }
  }, [text, isCaptchaLoading]);

  const generateCaptcha = (captchaText) => {
    if (typeof captchaText === "string" && captchaText.length > 0) {
      const fontSize = 20;
      const baseY = 40;

      const letters = captchaText
        .split("")
        .map((char, index) => {
          const x = 20 + index * 30 + Math.random() * 10;
          const y = baseY + Math.random() * 10 - 5;
          const rotate = Math.random() * 30 - 15;
          return `<text x="${x}" y="${y}" transform="rotate(${rotate}, ${x}, ${y})" font-size="${fontSize}" fill="#000" font-family="Arial">${char}</text>`;
        })
        .join("");

      const lines = Array.from({ length: 5 })
        .map(() => {
          const x1 = Math.random() * 200;
          const y1 = Math.random() * 60;
          const x2 = Math.random() * 200;
          const y2 = Math.random() * 60;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="2" />`;
        })
        .join("");

      const svg = `
        <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="60" fill="#f5f5f5" />
          ${letters}
          ${lines}
        </svg>
      `;

      setCaptchaSvg(svg);
    } else {
      setCaptchaSvg("");
    }
  };

  return (
    <div>
      {isCaptchaLoading ? (
        <div className="flex justify-center items-center">
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="#000"
            ariaLabel="captcha-loading"
          />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
      )}
    </div>
  );
};

export default CustomCaptcha;
