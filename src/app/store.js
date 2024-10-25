import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categorySlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import userReducer from "../features/user/userSlice";


export const store = configureStore({

  reducer: {

    sidebar: sidebarReducer,
    user: userReducer,
    category: categoryReducer,

  },
})

