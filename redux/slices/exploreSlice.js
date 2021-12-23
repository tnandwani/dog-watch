import {
  createSlice
} from '@reduxjs/toolkit'


export const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    loading: true,
    dogTags: [],
    myCoords: null,
    myZone: null,
    vapidToken: null,
    pushToken: '',
  },
  reducers: {
    saveCoords: (state, action) => {
      state.myCoords = action.payload
    },
    saveZone: (state, action) => {
      state.myZone = action.payload
    },
    addTag: (state, action) => {
      console.log("adding Tag", action.payload)
      if (action.payload.duid) {
        state.dogTags.push(action.payload)

      }
    },
    updateLoading: (state, action) => {
      state.loading = action.payload
    },
    updateVapid: (state, action) => {
      state.vapidToken = action.payload
    },
     updatePushToken: (state, action) => {
       state.pushToken = action.payload
     },


  },
})

// Action creators are generated for each case reducer function
export const {
  saveCoords,
  saveZone,
  addTag,
  updateVapid,
  updateLoading,
  updatePushToken
} = exploreSlice.actions

export default exploreSlice.reducer
