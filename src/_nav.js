import {
  cilCart,
  cilSpeedometer
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Ventas',
    to: '/vending',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Categorías',
        to: '/vending/category',
      },
      {
        component: CNavItem,
        name: 'Colecciones',
        to: '/vending/set',
      },
      {
        component: CNavItem,
        name: 'Productos',
        to: '/vending/product',
      },
      {
        component: CNavItem,
        name: 'Clientes',
        to: '/vending/client',
      },


    ],
  },

]

export default _nav
