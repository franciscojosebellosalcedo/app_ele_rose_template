import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import setReducer from "../features/set/setSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import userReducer from "../features/user/userSlice";
import colorReducer from "../features/color/colorSlice";
import sizeReducer from "../features/size/sizeSlice";
import typeVariantReducer from "../features/typeVariant/typeVariantSlice";
import clientReducer from "../features/client/clientSlice";
import departamentReducer from "../features/departament/departamentSlice";
import municipalityReducer from "../features/municipality/municipalitySlice";
import conditionPaymentReducer from "../features/conditionPayment/conditionPaymentSlice";
import paymentShapeReducer from "../features/paymentShape/paymentShapeSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import typeSupplierReducer from "../features/typeSupplier/typeSupplierSlice";

export const store = configureStore({

  reducer: {

    sidebar: sidebarReducer,

    user: userReducer,

    category: categoryReducer,

    set: setReducer,

    product: productReducer,

    color: colorReducer,

    size: sizeReducer,

    typeVariant: typeVariantReducer,

    client: clientReducer,

    departament: departamentReducer,

    municipality: municipalityReducer,

    conditionPayment: conditionPaymentReducer,

    paymentShape: paymentShapeReducer,

    supplier: supplierReducer,

    typeSupplier: typeSupplierReducer,

  },
})

