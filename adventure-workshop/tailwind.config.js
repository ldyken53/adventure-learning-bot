const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
    // colors:{
    //   'dragon-lair-green': '#295135',
    //   'uab-green': '#1e6b52',
    //   'dark-dragon-lair-green': '#1b3623',
    //   'light-uab-green': '#bbd2cb',
    //   'campus-green': '#80bc00',
    //   'mint-green': '#effbf1',
    //   'gray': colors.trueGray
    // }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
