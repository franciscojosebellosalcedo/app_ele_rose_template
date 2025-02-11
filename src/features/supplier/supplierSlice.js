import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {

    setAllSupplierFound: (state, action) => {
      state.data.found = action.payload
    },

    setAllSuppliers: (state, action) => {
      state.data.list = action.payload
    },

    addSupplier: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

    setSupplier: (state, action) => {
      const list = state.data.list
      const index = state.data.list.findIndex((client) => client._id === action.payload._id)
      list[index] = action.payload
      state.data.list = list

      const found = state.data.found
      const indexFound = state.data.found.findIndex((client) => client._id === action.payload._id)
      found[indexFound] = action.payload
      state.data.found = found
    },

  },
})

export const { setAllSuppliers, setAllSupplierFound, addSupplier , setSupplier } = supplierSlice.actions;

export default supplierSlice.reducer;
