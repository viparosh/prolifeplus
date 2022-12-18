module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridColumn: {
        'span-custom-1': '1',
        'span-custom-2': '2',
        'span-custom-3': '3',
        'span-custom-4': '4',
        'span-custom-5': '5',
        'span-custom-6': '6',
        'span-custom-7': '7',
      },
      minWidth: {
        searchModal: '750px',
        sideBar: '22em',
        selectedDate: '310px',
        requestBtn: '100px',
        timeModal: '430px',
      },
      maxWidth: {
        sideBar: '10em',
        sessionModal: '80%',
        selectedDate: '500px',
      },
      maxHeight: {
        patientModal: 'calc(100vh - 10em)',
      },
      height: {
        sessionModal: 'calc(100% - 164px)',
      },
      minHeight: {
        searchModal: '10em',
        selectedDate: '20em',
      },
      spacing: {
        contactFix: '1.05em',
      },
      borderColor: {
        inputBorder: '#D2D4E5',
        primaryBtnBorder: '#3F85ED',
      },
      textColor: {
        secondaryText: '#3C3C41',
        primaryText: '#3F85ED',
      },
      colors: {
        darkBlue: '#0C1223',
        lightGray: '#E8ECF2',
        primary: '#1B66D7',
        primaryBtn: '#1B66D7',
        secondaryBtn: '#3C3C41',
        customRed: '#ED3F3F',
        customOrange: '#ED933F',
      },
      inset: {
        '94px': '94px',
      },
    },
  },
  plugins: [],
}
