import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const municipalitySlice = createSlice({
  name: 'municipality',
  initialState,
  reducers: {

    setAllMunicipalities: (state, action) => {
      state.data.list = action.payload
    },

  },
})

export const { setAllMunicipalities } = municipalitySlice.actions;

export default municipalitySlice.reducer;
