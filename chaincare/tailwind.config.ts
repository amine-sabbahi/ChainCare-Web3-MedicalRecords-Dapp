import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'royal-blue': {
          '50': '#eef6ff',
          '100': '#dfefff',
          '200': '#c6e0ff',
          '300': '#a3cafe',
          '400': '#7fa9fa',
          '500': '#6089f4',
          '600': '#5371ea',
          '700': '#3550cd',
          '800': '#2e45a5',
          '900': '#2c3e83',
          '950': '#1a244c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add your desired font here
        serif: ['Merriweather', 'serif'], // Example font for text
      },
    },
  },
  plugins: [],
} satisfies Config;
