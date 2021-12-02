import {
  createSlice
} from '@reduxjs/toolkit'

// APPWRITE ACTIONS
import {
  uploadImage,
} from '../../database'



export const dogSlice = createSlice({
  name: 'dog',
  initialState: {
    dogName: 'Milo',
    breed: null,
    gender: null,
    age: null,
    visibility: null,
    profileImage: null,
    location: null,
    owner: null,
    email: null,
    phoneNumber: null,
  },
  reducers: {
    saveDogDetails: (state, action) => {
      state.dogName = action.payload.dogName
      state.age = action.payload.age
      state.gender = action.payload.gender
      state.breed = action.payload.breed
      state.profileImage = action.payload.profileImage
    },
    saveDogSettings: (state, action) => {
      state.visibility = action.payload.visibility
      state.location = action.payload.location
      state.phoneNumber = action.payload.phoneNumber

    },
    saveDogAccount: (state, action) => {
      state.email = action.payload.email
      state.owner = action.payload.ui
      if (state.profileImage) {
        uploadImage(state.profileImage);

      }
    },
    saveDogPic: (state, action) => {
      state.profileImage = action.payload.photoID
    },

  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogDetails,
  saveDogSettings,
  saveDogAccount,
  saveDogPic
} = dogSlice.actions

export default dogSlice.reducer
