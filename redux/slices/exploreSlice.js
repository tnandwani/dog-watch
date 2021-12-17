import {
  createSlice
} from '@reduxjs/toolkit'


export const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    dogTags: [],
    myCoords: null,
    myZone: null,
    vapidToken: null
  },
  reducers: {
    saveCoords: (state, action) => {
      state.myCoords = action.payload
    },
    saveZone: (state, action) => {
      state.myZone = action.payload
    },
    addTag: (state, action) => {
      state.dogTags.push(action.payload);
      console.log("dog Tags:",state.dogTags)
    },
    updateVapid: (state, action) => {
      state.vapidToken = action.payload
    },


  },
})

// Action creators are generated for each case reducer function
export const {
  saveCoords,
  saveZone,
  addTag,
  updateVapid
} = exploreSlice.actions

export default exploreSlice.reducer
