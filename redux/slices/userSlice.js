import {
  createSlice
} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    uid: null,
    dogs: [],
  },
  reducers: {
    saveUserAccount: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  saveUserAccount
} = userSlice.actions

export default userSlice.reducer
