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
    status: 'loading',
    notifications: [],
    pushToken: null,
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
      state.pushToken = action.payload.pushToken
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
      if (!state.dogs.includes(action.payload)) {
        state.dogs.push(action.payload)
      }
    },
    markLostDog: (state, action) => {
      state.dogs[action.payload.index].lost = action.payload.lost
      state.dogs[action.payload.index].contact = action.payload.EContact
    },
    updateLocation: (state, action) => {
      state.zone = action.payload.zone
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude

    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload)

    },
    changeDogInUser: (state, action) => {
      const index = state.dogs.findIndex(dog => dog.duid === action.payload.duid);
      state.dogs[index] = action.payload
    },
    removeDogfromUser: (state, action) => {
      const index = state.dogs.findIndex(dog => dog.duid === action.payload.duid);
      state.dogs.splice(index, 1)

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
  updateLocation,
  addNotification,
  changeDogInUser,
  removeDogfromUser

} = userSlice.actions

export default userSlice.reducer
