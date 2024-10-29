import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {

    setAllSizes: (state, action) => {
      state.data.list = action.payload
    },
  }
})

export const { setAllSizes } = sizeSlice.actions;

export default sizeSlice.reducer;
