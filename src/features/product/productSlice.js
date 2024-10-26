import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {

    setAllProductFound: (state, action) => {
      state.data.found = action.payload
    },

    setAllProducts: (state, action) => {
      state.data.list = action.payload
    },

    addProduct: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

    setProduct: (state, action) => {
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

export const { setAllProducts, setAllProductFound, addProduct , setProduct } = productSlice.actions;

export default productSlice.reducer;
