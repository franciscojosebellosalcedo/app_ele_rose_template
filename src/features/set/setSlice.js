import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const setSlice = createSlice({
  name: 'set',
  initialState,
  reducers: {

    setAllSetsFound: (state, action) => {
      state.data.found = action.payload
    },

    setAllSets: (state, action) => {
      state.data.list = action.payload
    },

    addSet: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

    setSet: (state, action) => {
      const list = state.data.list
      const index = state.data.list.findIndex((cat) => cat._id === action.payload._id)
      list[index] = action.payload
      state.data.list = list

      const found = state.data.found
      const indexFound = state.data.found.findIndex((cat) => cat._id === action.payload._id)
      found[indexFound] = action.payload
      state.data.found = found
    },

  },
})

export const { setAllSets, setAllSetsFound, addSet , setSet } = setSlice.actions;

export default setSlice.reducer;
