import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Category = React.lazy(() => import('./modules/vending/category/components/Category'))
const Set = React.lazy(() => import('./modules/vending/set/components/Set'))

const routes = [

  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Inicio', element: Dashboard },
  { path: '/vending', name: 'Ventas' },
  { path: '/vending/category', name: 'Categorías', element: Category },
  { path: '/vending/set', name: 'Colecciones', element: Set },

]

export default routes
