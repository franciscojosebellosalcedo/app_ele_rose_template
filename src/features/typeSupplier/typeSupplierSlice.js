import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
  },
}

export const typeSupplierSlice = createSlice({
  name: 'typeSupplier',
  initialState,
  reducers: {

    setAllTypesSuppliers: (state, action) => {
      state.data.list = action.payload
    },

    addTypeSupplier: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

  }
})

export const { setAllTypesSuppliers, addTypeSupplier } = typeSupplierSlice.actions;

export default typeSupplierSlice.reducer;
