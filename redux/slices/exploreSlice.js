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
    myZone: {
      members: [],
      lost: [],
      found: [],
    },
    dogView: null,
    
  },
  reducers: {
    saveCoords: (state, action) => {
      state.myCoords = action.payload
    },
    saveZone: (state, action) => {
      state.myZone = action.payload
    },
    addTag: (state, action) => {
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
    saveZoneData: (state, action) => {
      state.myZone = action.payload
    },
    updateDogView: (state, action) => {
      state.dogView = action.payload
    },
    foundZoneDog: (state, action) => {
      const index = state.myZone.lost.findIndex(alert => alert.duid === action.payload.duid);
      state.myZone.lost.splice(index, 1);
    },
    addLocalAlert: (state, action) => {
      state.myZone.lost.push(action.payload)
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
  updatePushToken,
  saveZoneData,
  updateDogView,
  foundZoneDog,
  addLocalAlert
} = exploreSlice.actions

export default exploreSlice.reducer
