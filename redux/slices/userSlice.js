import {
  createSlice
} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    uid: null,
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
      state.username = action.payload.username
      state.zone = action.payload.zone
      state.dogs = action.payload.dogs

    },
    saveDogCards: (state, action) => {
      if (!state.dogCards.includes(action.payload)) {
        state.dogCards.push(action.payload)
      }
      console.log("dog cards are: ", state.dogCards)

    },
    changeStatus: (state, action) => {
      state.status = action.payload
    },
    addDogtoUser: (state, action) => {
      console.log(action)
      // check if dog is in array 
      if (!state.dogs.includes(action.payload)) {
        state.dogs.push(action.payload)
      }
      console.log("dog list is: ", state.dogs)
    }

  },
})

// Action creators are generated for each case reducer function
export const {
  saveUserAccount,
  signInAccount,
  saveUserDetails,
  saveDogCards,
  changeStatus,
  addDogtoUser

} = userSlice.actions

export default userSlice.reducer
