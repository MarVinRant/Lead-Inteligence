import type { Config } from 'tailwindcss';
export default { content: ['./index.html', './src/**/*.{ts,tsx}'], theme: { extend: { colors: { navy: '#071525', panel: '#0d2035', line: '#1d3851', ice: '#9ee8ff', gold: '#e5b85c', ink: '#f0f5f8', muted: '#8296a8' }, fontFamily: { sans: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] } } }, plugins: [] } satisfies Config;

