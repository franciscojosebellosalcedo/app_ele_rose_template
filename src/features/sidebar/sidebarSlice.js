import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  data:{
    sidebarShow: true,
    sidebarUnfoldable: false,
    theme: "light"
  }
}

export const sidebarlice = createSlice({
  name: 'sidebar',
  initialState,

  reducers: {

    setSidebarShow: (state, action) => {
      state.data.sidebarShow = action.payload
    },

    setSidebarUnfoldable: (state, action) => {
      state.data.sidebarUnfoldable = action.payload
    },

    setTheme: (state, action) => {
      state.data.theme = action.payload
    },

  },
})

export const { setSidebarShow, setTheme, setSidebarUnfoldable } = sidebarlice.actions;

export default sidebarlice.reducer;
