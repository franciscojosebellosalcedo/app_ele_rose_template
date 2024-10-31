import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const departamentSlice = createSlice({
  name: 'departament',
  initialState,
  reducers: {

    setAllDepartaments: (state, action) => {
      state.data.list = action.payload
    },

  },
})

export const { setAllDepartaments } = departamentSlice.actions;

export default departamentSlice.reducer;
