import {
  createSlice
} from '@reduxjs/toolkit'


export const interfaceSlice = createSlice({
  name: 'interface',
  initialState: {
    screen: null,
    modals: {
      showDogModal: false,
      showLostModal: false

    },
    alerts: {
      createAccount: 'Must be atleast 6 characters.',
      login: 'Must be atleast 6 characters.'
    },
    progress: {
      dog: 0,
    }
  },
  reducers: {

    updateShowDogModal: (state, action) => {
      state.modals.showDogModal = action.payload
    },
    updateShowLostModal: (state, action) => {
      state.modals.showLostModal = action.payload
    },

    updateLoginAlert: (state, action) => {
      state.alerts.login = action.payload
    },
    updateCreateAlert: (state, action) => {
      state.alerts.createAccount = action.payload
    },

    
    updateDogProgress: (state, action) => {
      state.progress.dog = action.payload
    },
    setTabScreen: (state, action) => {
      state.screen = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const {
  updateShowDogModal,
  updateLoginAlert,
  updateCreateAlert,
  updateDogProgress,
  setTabScreen,
  updateShowLostModal

} = interfaceSlice.actions

export default interfaceSlice.reducer
