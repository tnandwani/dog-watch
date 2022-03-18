import {
  createSlice
} from '@reduxjs/toolkit'


const detaultState = {
  dogName: 'Dog Name',
  editing: false,
  updated: null,
  duid: null,
  breed: null,
  lost: false,
  gender: null,
  age: null,
  visibility: null,
  profileImage: "https://cdn.pixabay.com/photo/2013/11/28/11/31/dog-220273_960_720.jpg",
  latitude: null,
  longitude: null,
  zone: "Unverified",
  owner: null,
  email: null,
  contact: null,
  alert: null,
  reported: [],
  personality: {
    people: null,
    otherDogs: null,
    sharing: null,
    energy: null,
    sn: true,
    training: null,
    bio: ""
  }
}

export const rawDogSlice = createSlice({
  name: 'rawDog',
  initialState: detaultState,
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
      state.updated = new Date().toISOString()
      state.personality = action.payload
    },
    createDUID: (state, action) => {
      state.duid = action.payload
    },
    setEditing: (state, action) => {
      state.editing = action.payload
    },
    importDog: (state, action) => {
      state.dogName = action.payload.dogName
      state.duid = action.payload.duid
      state.breed = action.payload.breed
      state.gender = action.payload.gender
      state.age = action.payload.age
      state.visibility = action.payload.visibility
      state.profileImage = action.payload.profileImage
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.zone = action.payload.zone
      state.owner = action.payload.owner
      state.personality = action.payload.personality
      state.editing = true
    },
    resetRawDog: (state, action) => {
      state.dogName = detaultState.dogName
      state.duid = detaultState.duid
      state.breed = detaultState.breed
      state.gender = detaultState.gender
      state.age = detaultState.age
      state.visibility = detaultState.visibility
      state.profileImage = detaultState.profileImage
      state.latitude = detaultState.latitude
      state.longitude = detaultState.longitude
      state.zone = detaultState.zone
      state.owner = detaultState.owner
      state.personality = detaultState.personality
      state.email = detaultState.email
      state.contact = detaultState.contact
      state.lost = detaultState.lost
      state.editing = false

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
  createDUID,
  importDog,
  resetRawDog,
  setEditing

} = rawDogSlice.actions

export default rawDogSlice.reducer
