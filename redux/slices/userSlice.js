import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    dogName: 'Milo',
    breed: null,
    gender: null,
    age: null
  },
  reducers: {
    saveDogDetails: (state, action) => {
        state.dogName = action.payload.dogName
        state.age = action.payload.age
        state.gender = action.payload.gender
        state.breed = action.payload.breed

      },
  },
})

// Action creators are generated for each case reducer function
export const {saveDogDetails} = userSlice.actions

export default userSlice.reducer
