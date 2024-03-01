module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gradientColorStops: {
        'red-blue': ['#ff0000', '#00008b'],
      },
    },
  },
  variants: {},
  plugins: [],
}
