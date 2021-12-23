import {
  createSlice
} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    uid: null,
    latitude: null,
    longitude: null,
    zone: "Unverified",
    username: null,
    dogs: [],
    dogCards: [],
    status: 'loading'
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
    saveUserDetails: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
      state.zone = action.payload.zone
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.dogs = action.payload.dogs

    },
    saveDogCards: (state, action) => {
      if (!state.dogCards.includes(action.payload)) {
        state.dogCards.push(action.payload)
      }
    },
    changeStatus: (state, action) => {
      state.status = action.payload
    },
    addDogtoUser: (state, action) => {
      // check if dog is in array 
      if (!state.dogs.includes(action.payload)) {
        state.dogs.push(action.payload)
      }
      console.log("users dog list is: ", state.dogs)
    },
    markLostDog: (state, action) => {
      state.dogs[action.payload.index].lost = true
      state.dogs[action.payload.index].contact = action.payload.EContact
    },
    updateLocation: (state, action) => {
      console.log("attempt to locate:", action.payload)
      state.zone = action.payload.zone
      state.latitude = action.payload.coords.latitude
      state.longitude = action.payload.coords.longitude

    },

  },
})

// Action creators are generated for each case reducer function
export const {
  saveUserAccount,
  signInAccount,
  saveUserDetails,
  saveDogCards,
  changeStatus,
  addDogtoUser,
  markLostDog,
  updateLocation

} = userSlice.actions

export default userSlice.reducer
