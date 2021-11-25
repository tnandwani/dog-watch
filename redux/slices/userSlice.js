import {
  createSlice
} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    dogName: 'Milo',
    breed: null,
    gender: null,
    age: null,
    accuracy: null,
    visibility: null,
    location: null
  },
  reducers: {
    saveDogDetails: (state, action) => {
      state.dogName = action.payload.dogName
      state.age = action.payload.age
      state.gender = action.payload.gender
      state.breed = action.payload.breed

    },
    saveDogSettings: (state, action) => {
      state.accuracy = action.payload.accuracy
      state.visibility = action.payload.visibility
      state.location = action.payload.location
    },
    saveDogAccount: (state, action) => {
      state.email = action.payload.email
      state.number = action.payload.number
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogDetails,
  saveDogSettings,
  saveDogAccount
} = userSlice.actions

export default userSlice.reducer
