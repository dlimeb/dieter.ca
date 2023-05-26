/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [ "system-ui", "sans-serif" ],
        serif: ["dolly-new", "Charter", "Bitstream Charter", "Sitka Text", "Cambria", "serif"],
        mono: ["input-mono-narrow", "ui-monospace", "Cascadia Code", "Source Code Pro", "Menlo", "Consolas", "DejaVu Sans Mono", "monospace"]
      },
      container: {
        center: true,
      }
    }
  },
  plugins: [],
}