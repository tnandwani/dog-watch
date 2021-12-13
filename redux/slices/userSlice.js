import {
  createSlice
} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    uid: null,
    zone: false,
    username: null,
    dogs: [],
    dogCards: [],
    status: 'loading'
  },
  reducers: {
    saveUserAccount: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
    },
    signInAccount: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
      state.username = action.payload.name
    },
    saveUserDetails: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
      state.username = action.payload.username
      state.zone = action.payload.zone
      state.dogs = action.payload.dogs

    },
    saveDogCards: (state, action) => {
      state.dogCards.push(action.payload)
    },
    changeStatus: (state, action) => {
      state.status = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const {
  saveUserAccount,
  signInAccount,
  saveUserDetails,
  saveDogCards,
  changeStatus

} = userSlice.actions

export default userSlice.reducer
