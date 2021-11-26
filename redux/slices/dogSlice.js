import {
  createSlice
} from '@reduxjs/toolkit'

export const dogSlice = createSlice({
  name: 'dog',
  initialState: {
    dogName: 'Milo',
    breed: null,
    gender: null,
    age: null,
    accuracy: null,
    visibility: null,
    location: null,
    owner: null
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
      state.owner = action.payload.uid
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogDetails,
  saveDogSettings,
  saveDogAccount
} = dogSlice.actions

export default dogSlice.reducer
