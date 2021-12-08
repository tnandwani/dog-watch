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
    
  },
})

// Action creators are generated for each case reducer function
export const {
  saveUserAccount,
  signInAccount
} = userSlice.actions

export default userSlice.reducer
