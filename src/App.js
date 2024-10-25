import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { toast, Toaster } from 'sonner'
import LoginGuard from './guards/LoginGuard'
import AuthGuard from './guards/AuthGuard'
import { useDispatch } from 'react-redux'
import { setUser } from './features/user/userSlice'
import { URL_BASE } from './utils'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const HEADERS={
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type":"application/json"
  }

  const getNewTokenUser = async (token) => {
    HEADERS['access-x'] = `bearer ${token}`
    const response = await fetch(URL_BASE + 'user/refress-token', {
      method: 'GET',
      headers: HEADERS,
    })
    return response.json()
  }

  const getNewAccessTokenUser = async () => {
    try {

      const dataUser = JSON.parse(localStorage.getItem('dataEleRose'))

      if (dataUser) {

        const responseNewToken = await getNewTokenUser(dataUser.refressToken);

        if (responseNewToken.status === 200 && responseNewToken.response) {

          const data = responseNewToken.data;

          const dataUser = {
            accessToken: data.accessToken,
            refressToken: data.refressToken,
            user: data.user,
          }

          localStorage.setItem('dataEleRose', JSON.stringify(dataUser))
          dispatch(setUser(data));

        }

      }
    } catch (error) {

      toast.error(error.message);

    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)

  }, []);

  useEffect(()=>{

    getNewAccessTokenUser()

  },[])

  return (
    <HashRouter>
      <Toaster position="top-center" expand={false} richColors />

      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route element={<LoginGuard />}>
            <Route exact path="/login" name="Login Page" element={<Login />} />
          </Route>

          <Route element={<AuthGuard />}>
            <Route exact path="/register" name="Register Page" element={<Register />} />
          </Route>

          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />

          <Route element={<AuthGuard />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
