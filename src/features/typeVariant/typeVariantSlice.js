import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const typeVariantSlice = createSlice({
  name: 'typeVariant',
  initialState,
  reducers: {

    setAllTypesVariant: (state, action) => {
      state.data.list = action.payload
    },
  }
})

export const { setAllTypesVariant } = typeVariantSlice.actions;

export default typeVariantSlice.reducer;
