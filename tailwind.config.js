/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [ "IBM Plex Sans", "sans-serif" ],
        serif: ["Charter", "Bitstream Charter", "Sitka Text", "Cambria", "serif"],
        mono: ["ui-monospace", "Cascadia Code", "Source Code Pro", "Menlo", "Consolas", "DejaVu Sans Mono", "monospace"]
      },
      container: {
        center: true,
      }
    }
  },
  plugins: [],
}