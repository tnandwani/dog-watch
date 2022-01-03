import { configureStore } from '@reduxjs/toolkit'
import exploreSlice from './slices/exploreSlice'
import rawDogSlice from './slices/rawDogSlice'
import userSlice from './slices/userSlice'

export default configureStore({
  reducer: {
    user: userSlice,
    rawDog: rawDogSlice,
    explore: exploreSlice
  },
})
