import {
  createSlice
} from '@reduxjs/toolkit'


export const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    loading: true,
    dogTags: [],
    myCoords: null,
    vapidToken: null,
    pushToken: null,
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
      state.myZone.members = action.payload
    },
    updateDogView: (state, action) => {
      state.dogView = action.payload
    },
    foundZoneDog: (state, action) => {
      const index = state.myZone.lost.findIndex(alert => alert.duid === action.payload);
      state.myZone.lost.splice(index, 1);
    },
    addLocalAlert: (state, action) => {
      state.myZone.lost.push(action.payload)
    },
    removeTag: (state, action) => {
      const indexExplore = state.dogTags.findIndex(tags => tags.duid === action.payload);
      state.dogTags.splice(indexExplore, 1);
      const indexLost = state.myZone.lost.findIndex(alert => alert.duid === action.payload);
      state.myZone.lost.splice(indexLost, 1);
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
  addLocalAlert,
  removeTag
} = exploreSlice.actions

export default exploreSlice.reducer
