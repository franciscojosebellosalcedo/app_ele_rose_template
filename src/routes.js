import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Category = React.lazy(() => import('./modules/vending/category/components/Category'))

const routes = [

  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Inicio', element: Dashboard },
  { path: '/vending', name: 'Ventas' },
  { path: '/vending/category', name: 'Categorías', element: Category },

]

export default routes
