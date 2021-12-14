import {
  createSlice
} from '@reduxjs/toolkit'


export const dogSlice = createSlice({
  name: 'dog',
  initialState: {
    dogName: '',
    breed: null,
    gender: null,
    age: null,
    visibility: null,
    profileImage: null,
    zone: null,
    coords: null,
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
      state.zone = action.payload.location.zone
      state.coords = action.payload.location.coords
      state.phoneNumber = action.payload.phoneNumber

    },
    saveDogAccount: (state, action) => {
      state.email = action.payload.email
      state.owner = action.payload.ui
      if (state.profileImage) {
        uploadImage(state.profileImage);

      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogDetails,
  saveDogSettings,
  saveDogAccount,
  saveDogPic,
  saveDogName
} = dogSlice.actions

export default dogSlice.reducer
