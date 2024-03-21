/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontUse: ["Poppins"],
      },
      height: {
        vh: "200vh",
      },
      boxShadow: {
        custom: "0px 11px 19px 0px rgba(0, 0, 0, 0.25)",
      },
      fontWeight: {
        custom: "600",
      },
      fontSize: {
        "hover-lg": ["1.125rem", { hover: "1.25rem" }],
      },
      colors: {
        "custom-red": "#c70039",
        "custom-orange": "#ff5733",
        "custom-purple": "#571845",
        feedbackColor: "#d9d9d9",
        walletColor: "#180C08",
        textColor: "#3811B2",
        btnColor: "#3505B2",
        footerText: "#3811B2",
        shadeBlue: "#3C03BA",
        shadeSkyBlue: "#408FBF",
        custumPurple: "rgba(50, 0, 153, 1)",
        custumSky: "rgba(114, 131, 234, 1)",
      },
      translate: {
        full: "100%",
        "-full": "-100%",
      },
      scale: {
        90: "0.9",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-30deg)" },
          "50%": { transform: "rotate(30deg)" },
        },
        spin: {
          '0%, 100%': {
            opacity: '0',
            transform: 'rotateX(0deg)',
          },
          '50%': {
            opacity: '1',
            transform: 'rotateX(360deg)',
          },
        },
      },
      animation: {
        wiggle: "wiggle 5s ease-in-out infinite",
        spin: 'spin 2s ease-in-out infinite',
      },
    },
    screens: {
      sxxs: "255px",
      sxs: "265px",
      sxs1: "275px",
      sxs2: "285px",
      sxs3: "295px",
      ss: "305px",
      ss1: "315px",
      ss2: "325px",
      ss3: "335px",
      ss4: "345px",
      dxs: "375px",
      xxs: "405px",
      xxs1: "425px",
      sm1: "480px",
      sm4: "508px",
      sm2: "538px",
      sm3: "550px",
      sm: "640px",
      md: "768px",
      md1: "870px",
      md2: "914px",
      md3: "936px",
      lg: "976px",
      dlg: "1024px",
      lg1: "1100px",
      lgx: "1134px",
      dxl: "1280px",
      dxl1: "1380px",
      xl: "1440px",
      xl2: "1600px",
    },
  },
  plugins: [],
};
