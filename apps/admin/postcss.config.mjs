/**
 * Tailwind v4 usa o plugin dedicado de PostCSS (`@tailwindcss/postcss`),
 * que substitui o antigo par `tailwindcss` + `autoprefixer`.
 * A configuração de tema vive no CSS (`app/globals.css`), não num JS config.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
