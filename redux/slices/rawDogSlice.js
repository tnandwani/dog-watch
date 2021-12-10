import {
  createSlice
} from '@reduxjs/toolkit'

export const rawDogSlice = createSlice({
  name: 'dog',
  initialState: {
    dogName: 'Test',
    breed: null,
    gender: null,
    age: null,
    visibility: null,
    profileImage: "https://ggsc.s3.amazonaws.com/images/uploads/The_Science-Backed_Benefits_of_Being_a_Dog_Owner.jpg",
    location: {
      coords: "Location",
      address: "City"
    },
    owner: null,
    email: null,
    contact: null,
  },

  
  reducers: {
    saveDogName: (state, action) => {
      state.dogName = action.payload
    },
    saveDogBreed: (state, action) => {
      state.breed = action.payload
    },
    saveDogAge: (state, action) => {
      state.age = action.payload
    },
    saveDogGender: (state, action) => {
      state.gender = action.payload
    },
    saveDogPic: (state, action) => {
      state.profileImage = action.payload
    },
    saveVisibility: (state, action) => {
      state.visibility = action.payload
    },
    saveContact: (state, action) => {
      state.contact = action.payload
    },
    saveLocation: (state, action) => {
      state.location = action.payload
    }

  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogName,
  saveDogBreed,
  saveDogAge,
  saveDogGender,
  saveDogPic,
  saveVisibility,
  saveContact,
  saveLocation

} = rawDogSlice.actions

export default rawDogSlice.reducer
