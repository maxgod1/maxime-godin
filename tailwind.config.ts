import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'


const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
      animation: {
        "fade-in": 'fade-in 0.5s ease-in-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    require('tailwindcss-motion'),
    plugin(function ({ addUtilities }) {
      addUtilities({
          '.grainy-background::before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundImage: "url('/noise/noise.svg')",
              backgroundRepeat: 'repeat',
              opacity: '0.4',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
              zIndex: '1',
              filter: 'invert(1)',
          },
          '.dark .grainy-background::before': {
              filter: 'invert(0)',
              
          },
      })
  }),
  ],
  
};
export default config;
