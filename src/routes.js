import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Category = React.lazy(() => import('./modules/vending/category/components/Category'))
const Set = React.lazy(() => import('./modules/vending/set/components/Set'))
const Product = React.lazy(()=> import("./modules/vending/product/components/Product"))
const FormProduct = React.lazy(()=> import("./modules/vending/product/components/FormProduct"))
const FormClient = React.lazy(()=> import("./modules/vending/client/components/FormClient"))
const Client = React.lazy(()=> import("./modules/vending/client/components/Client"))
const Order = React.lazy(()=> import("./modules/vending/order/components/Order"))
const FormOrder = React.lazy(()=> import("./modules/vending/order/components/FormOrder"))

const routes = [

  { path: '/', exact: true, name: 'Home' },

  { path: '/dashboard', name: 'Inicio', element: Dashboard },

  { path: '/vending', name: 'Ventas' },

  { path: '/vending/category', name: 'Categorías', element: Category },

  { path: '/vending/set', name: 'Colecciones', element: Set },

  { path: '/vending/product', name: 'Productos', element: Product },
  { path: '/vending/product/createProduct', name: 'Crear producto', element: FormProduct },
  { path: '/vending/product/editProduct/:id', name: 'Editar producto', element: FormProduct },

  { path: '/vending/client', name: 'Clientes', element: Client },
  { path: '/vending/client/createClient', name: 'Crear cliente', element: FormClient },

  { path: '/vending/client/editClient/:id', name: 'Editar cliente', element: FormClient },

  { path: '/vending/pedidos', name: 'Pedidos', element: Order },
  { path: '/vending/order/createOrder', name: 'Crear pedido', element: FormOrder },

]

export default routes;
