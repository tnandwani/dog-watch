import {
  createSlice
} from '@reduxjs/toolkit'

export const rawDogSlice = createSlice({
  name: 'rawDog',
  initialState: {
    dogName: 'Test',
    duid: null,
    breed: null,
    lost: false,
    gender: null,
    age: null,
    visibility: null,
    profileImage: "https://freesvg.org/img/Dog-Leash.png",
    latitude: null,
    longitude: null,
    zone: "Unverified",
    owner: null,
    email: null,
    contact: null,
    personality: {
      people: null,
      otherDogs: null,
      sharing: null,
      energy: null,
      sn: null,
      training: null,
      bio: null
    }
  },


  reducers: {
    // dog details
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
      state.zone = action.payload.zone
      state.longitude = action.payload.longitude
      state.latitude = action.payload.latitude
    },
    saveOwner: (state, action) => {
      state.owner = action.payload
    },
    // personality 
    savePersonality: (state, action) => {
      state.personality = action.payload
    },
    createDUID: (state, action) => {
      state.duid = action.payload
    },

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
  saveLocation,
  saveOwner,
  savePersonality,
  createDUID

} = rawDogSlice.actions

export default rawDogSlice.reducer
