import { configureStore } from '@reduxjs/toolkit'
import dogSlice from './slices/dogSlice'
import rawDogSlice from './slices/rawDogSlice'
import userSlice from './slices/userSlice'

export default configureStore({
  reducer: {
    user: userSlice,
    dog: dogSlice,
    rawDog: rawDogSlice
  },
})
