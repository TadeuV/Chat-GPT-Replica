/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor:['checked'],
      borderColor:['checked'],
      keyframes:{
        ripple:{
          '0%':{width:'0px',height:'0px',opacity:0.5},
          '100%':{width:'500px',height:'500px',opacity:0}
        }
      },
      animation:{
        ripple:'ripple 1s linear infinite',
      }
    },
  },
  plugins: [
    require('tailwindcss-ripple')()
  ],
}
