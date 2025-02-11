import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const conditionPaymentSlice = createSlice({
  name: 'conditionPayment',
  initialState,
  reducers: {

    setAllConditionPayment: (state, action) => {
      state.data.list = action.payload
    },
  }
})

export const { setAllConditionPayment } = conditionPaymentSlice.actions;

export default conditionPaymentSlice.reducer;
