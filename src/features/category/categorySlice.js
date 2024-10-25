import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    list: [],
    found: [],
  },
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {

    searchCategory: (state, action) => {
      state.data.found = state.data.list.filter((cat) =>
        cat.name.toLowerCase().includes(action.payload),
      )
    },

    setAllCategoriesFound: (state, action) => {
      state.data.found = action.payload
    },

    setAllCategories: (state, action) => {
      state.data.list = action.payload
    },

    addCategory: (state, action) => {
      state.data.list = [action.payload, ...state.data.list]
    },

    setCategory: (state, action) => {
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

export const { setAllCategories, searchCategory, setAllCategoriesFound, addCategory , setCategory } =
  categorySlice.actions

export default categorySlice.reducer
