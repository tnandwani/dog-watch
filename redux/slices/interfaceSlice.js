import {
  createSlice
} from '@reduxjs/toolkit'


export const interfaceSlice = createSlice({
  name: 'interface',
  initialState: {
    screen: null,
    modals: {
      showDogModal: false,
      showLostModal: false,
      showFeedback: false
    },
    alerts: {
      createAccount: 'Must be atleast 6 characters.',
      login: 'Must be atleast 6 characters.'
    },
    isPublishing: false,
    progress: {
      dog: 0,
    },
  },
  reducers: {

    updateShowDogModal: (state, action) => {
      state.modals.showDogModal = action.payload
    },
    updateShowLostModal: (state, action) => {
      state.modals.showLostModal = action.payload
    },
    updateShowFeedback: (state, action) => {
      state.modals.showFeedback = action.payload
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
    setIsPublishing: (state, action) => {
      state.isPublishing = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateShowDogModal,
  updateLoginAlert,
  updateShowFeedback,
  updateCreateAlert,
  updateDogProgress,
  setTabScreen,
  updateShowLostModal,
  setIsPublishing

} = interfaceSlice.actions

export default interfaceSlice.reducer
