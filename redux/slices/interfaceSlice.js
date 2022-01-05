import {
  createSlice
} from '@reduxjs/toolkit'


export const interfaceSlice = createSlice({
  name: 'interface',
  initialState: {
    modals: {
      showDogModal: false,
    },
    alerts : {
      createAccount: 'Must be atleast 6 characters.',
      login: 'Must be atleast 6 characters.'
    }
  },
  reducers: {

    updateShowDogModal: (state, action) => {
      state.modals.showDogModal = action.payload
    },
    updateLoginAlert: (state, action) => {
      state.alerts.login = action.payload
    },
    updateCreateAlert: (state, action) => {
      state.alerts.createAccount = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateShowDogModal,
  updateLoginAlert,
  updateCreateAlert

} = interfaceSlice.actions

export default interfaceSlice.reducer
