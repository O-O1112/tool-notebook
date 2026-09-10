/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/client/index.html',
    './src/client/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--muted)',
        'ink-faint': 'var(--faint)',
        line: 'var(--line)',
        coral: {
          50: '#fff9f6',
          100: '#ffede7',
          200: '#ffd7cd',
          300: '#ffbaa9',
          400: '#f5927b',
          500: '#e17b62',
          600: '#cf5e43',
          700: '#ae4931',
        },
      },
      borderRadius: {
        'notebook': '17px',
        'notebook-sm': '12px',
      },
      boxShadow: {
        'notebook': '0 13px 34px rgba(53, 66, 72, 0.06)',
        'notebook-hover': '0 18px 40px rgba(53, 66, 72, 0.10)',
      },
    },
  },
  plugins: [],
};
