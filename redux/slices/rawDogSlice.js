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
    location: null,
    owner: null,
    email: null,
    phoneNumber: null,
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
    }

  },
})

// Action creators are generated for each case reducer function
export const {
  saveDogName,
  saveDogBreed,
  saveDogAge,
  saveDogGender,
  saveDogPic

} = rawDogSlice.actions

export default rawDogSlice.reducer
