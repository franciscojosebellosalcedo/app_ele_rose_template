import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const paymentShapeSlice = createSlice({
  name: 'paymentShape',
  initialState,
  reducers: {

    setAllPaymentShape: (state, action) => {
      state.data.list = action.payload
    },
  }
})

export const { setAllPaymentShape } = paymentShapeSlice.actions;

export default paymentShapeSlice.reducer;
