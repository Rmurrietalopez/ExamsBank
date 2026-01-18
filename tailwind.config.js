// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        goCELPIP: {
          "primary": "#d40000",
          "primary-content": "#ffffff",
          "secondary": "#ba8437",
          "secondary-content": "#ffffff",
          "accent": "#c4baad",
          "accent-content": "#1f1b16",
          "neutral": "#c4baad",
          "base-100": "#fffcf9",
          "base-200": "#f2eddb",
          "base-300": "#e0d6c7",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light",
    ],
  },
};
