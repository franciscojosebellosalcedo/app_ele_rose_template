import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {

    setAllClientFound: (state, action) => {
      state.data.found = action.payload
    },

    setAllClients: (state, action) => {
      state.data.list = action.payload
    },

    addClient: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

    setClient: (state, action) => {
      const list = state.data.list
      const index = state.data.list.findIndex((product) => product._id === action.payload._id)
      list[index] = action.payload
      state.data.list = list

      const found = state.data.found
      const indexFound = state.data.found.findIndex((product) => product._id === action.payload._id)
      found[indexFound] = action.payload
      state.data.found = found
    },

  },
})

export const { setAllClients, setAllClientFound, addClient , setClient } = clientSlice.actions;

export default clientSlice.reducer;
