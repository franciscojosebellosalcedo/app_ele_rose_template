import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {

    setAllColors: (state, action) => {
      state.data.list = action.payload
    },
  }
})

export const { setAllColors } = colorSlice.actions;

export default colorSlice.reducer;
