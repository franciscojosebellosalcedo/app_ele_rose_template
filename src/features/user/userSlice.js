import { createSlice } from '@reduxjs/toolkit'

const data = JSON.parse(localStorage.getItem('dataEleRose'))

const initialState = {
  data: {
    refressToken: null,
    accessToken: null,
    user: {
      _id: data ? data.user._id : null,
      email: data ? data.user.email : null,
      name: data ? data.user.name : null,
    },
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    logoutUser: (state) => {
      state.data = {}
      localStorage.removeItem('dataEleRose')
    },

    setUser: (state, action) => {
      state.data = action.payload
      const dataUser = {
        refressToken: action.payload.refressToken,
        user: action.payload.user,
      }
      localStorage.setItem('dataEleRose', JSON.stringify(dataUser))
    },

    updateUser: (state, action) => {
      state.data.user = action.payload
    },

    removeUser: (state) => {
      state.data = {}
      localStorage.removeItem('dataEleRose')
    },
  },
})

export const { setUser, updateUser, logoutUser, removeUser } = userSlice.actions

export default userSlice.reducer
