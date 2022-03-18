import {
  createSlice
} from '@reduxjs/toolkit'

import {
  getHomies
} from '../../database';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    uid: 'unknown',
    created: null,
    device: 'unknown',
    latitude: null,
    longitude: null,
    zone: "Unverified",
    username: null,
    dogs: [],
    status: 'loading',
    notifications: [],
    pushToken: '',
    reported: []
  },
  reducers: {
    signInAccount: (state, action) => {
      state.email = action.payload.email
      state.uid = action.payload.uid
    },
    saveUserDetails: (state, action) => {

      state.email = action.payload.email
      state.uid = action.payload.uid
      state.created = action.payload.created
      state.zone = action.payload.zone
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.pushToken = action.payload.pushToken
      state.reported = action.payload.reported

    },
    saveDogCards: (state, action) => {
      state.dogs.push(action.payload);
    },
    getDevice: (state, action) => {
      state.device = action.payload
    },
    changeStatus: (state, action) => {
      state.status = action.payload
    },
    markLostDog: (state, action) => {
      state.dogs[action.payload.index].lost = action.payload.lost
      state.dogs[action.payload.index].contact = action.payload.EContact
    },
    updateLocation: (state, action) => {

      if (state.zone == 'Unverified' && action.payload.zone != 'Unverified') {
        // first time getting zone
        state.zone = action.payload.zone
        state.latitude = action.payload.latitude
        state.longitude = action.payload.longitude
      } else {
        state.zone = action.payload.zone
        state.latitude = action.payload.latitude
        state.longitude = action.payload.longitude
      }


    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload)
    },
    changeDogInUser: (state, action) => {
      const index = state.dogs.findIndex(dog => dog.duid === action.payload.duid);
      state.dogs[index] = action.payload
    },
    removeDogfromUser: (state, action) => {
      const index = state.dogs.findIndex(dog => dog.duid === action.payload);
      state.dogs.splice(index, 1)
    },
    reportUser: (state, action) => {
      state.reported++;
    },

  },
})

// Action creators are generated for each case reducer function
export const {
  signInAccount,
  saveUserDetails,
  saveDogCards,
  changeStatus,
  markLostDog,
  getDevice,
  updateLocation,
  addNotification,
  changeDogInUser,
  removeDogfromUser,
  reportUser

} = userSlice.actions

export default userSlice.reducer
