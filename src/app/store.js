import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import setReducer from "../features/set/setSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({

  reducer: {

    sidebar: sidebarReducer,

    user: userReducer,

    category: categoryReducer,

    set: setReducer,

    product: productReducer,

  },
})

