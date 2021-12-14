import {
  createSlice
} from '@reduxjs/toolkit'


export const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    dogTags: [],
    myCoords: null,
    myZone: null,
  },
  reducers: {
    saveCoords: (state, action) => {
      state.myCoords = action.payload
    },
    saveZone: (state, action) => {
      state.myZone = action.payload
    },


  },
})

// Action creators are generated for each case reducer function
export const {
  saveCoords,
  saveZone
} = exploreSlice.actions

export default exploreSlice.reducer
