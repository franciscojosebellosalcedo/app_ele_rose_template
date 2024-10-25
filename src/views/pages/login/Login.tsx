import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'
import { IDataLogin } from '../../../models/models'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../features/user/userSlice'
import { UserService } from '../../../user.service'
import clsx from 'clsx'

const initialValues: IDataLogin = {
  email: '',
  password: '',
}

const schemaValidation = Yup.object().shape({
  email: Yup.string()
    .required('Se requiere el correo electrónico')
    .email('Debe de ser un correo electrónico'),

  password: Yup.string()
  .required("Se requiere la contraseña")
  .min(8, "Mínimo 8 caracteres")
})

const userService : UserService = UserService.getInstance();

const Login = () => {

  const [isLoader, setIsLoader] = useState<boolean>(false);

  const navigate = useNavigate()

  const dispatch = useDispatch()

  // init sesion
  const login = async (values: IDataLogin) => {

    setIsLoader(true);

    try {

      const responseLogin = await userService.login(values);

      if (responseLogin.status === 200 && responseLogin.response) {

        const dataResponse = responseLogin.data;

        dispatch(setUser(dataResponse));

        navigate(`/dashboard`);

      } else {

        toast.error(responseLogin.message);

      }

    } catch (error: any) {

      toast.error(error.message);

    }

    setIsLoader(false);
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values: IDataLogin) => {
      await login(values)
    },
  })

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <CCardImage
                    height={200}
                    width={80}
                    src="https://ucarecdn.com/db844e6a-7348-40e8-96a1-cee259cea093/logoappelerose.png"
                  />
                  <h1>Iniciar sesión</h1>
                  <p className="text-body-secondary">Inicia sesión en tu cuenta</p>

                  <div className="mb-3">
                  <CInputGroup >
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>

                    <CFormInput
                      placeholder="Correo"
                      {...formik.getFieldProps('email')}
                      className={clsx(
                        'form-control',
                        { 'is-invalid': formik.touched.email && formik.errors.email },
                        { 'is-valid': formik.touched.email && !formik.errors.email },
                      )}
                     />

                  </CInputGroup>
                  {formik.touched.email && formik.errors.email && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" style={{ color: 'red' }}>
                            {formik.errors.email}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                  <CInputGroup >
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>

                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      {...formik.getFieldProps('password')}
                      className={clsx(
                        'form-control',
                        { 'is-invalid': formik.touched.password && formik.errors.password },
                        { 'is-valid': formik.touched.password && !formik.errors.password },
                      )}
                     />

                  </CInputGroup>
                     {formik.touched.password && formik.errors.password && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" style={{ color: 'red' }}>
                            {formik.errors.password}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CRow>
                    <CCol xs={6}>
                      <CButton
                        onClick={() => formik.submitForm()}
                        disabled={isLoader}
                        color="primary"
                        className="px-4"
                      >
                        {!isLoader && <span className="indicator-label">Entrar</span>}
                        {isLoader && (
                          <span className="indicator-progress" style={{ display: 'block' }}>
                            Cargando...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        )}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton disabled={isLoader} color="link" className="px-0">
                        Olvidó la contraseña?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
