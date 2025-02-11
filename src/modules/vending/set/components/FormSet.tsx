import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import * as Yup from 'yup'
import { addSet, setSet } from '../../../../features/set/setSlice'
import { IResponseHttp, ISet, ISetModel, IUserModel } from '../../../../models/models'
import { colorRedInfoInput, compressImage, convertFileToBase64, handleSubmitFileUploadcare } from '../../../../utils'
import { SetService } from '../set.service'

type Props = {
  isOpenModal: boolean
  setIsOpenModalSet: Function
  setSelected: ISetModel | null
  setSetSelected: Function
  paginateSets: Function
}

const schemaValidation = Yup.object().shape({
  name: Yup.string().required('Se requiere el nombre de la colección').min(5, 'Mínimo 5 caracteres')
  .test(
    'no-espacios-solo',
    'Se requiere el nombre de la colección',
    (value) => value.trim().length > 0
  ),

  status: Yup.number()
    .required('Se require el status')
    .test('is-number', 'Valor no válido', (value) => {
      if (Number.isInteger(value)) return true
      if (!value) return false
      return isNaN(value)
    }),
})

const setService: SetService = SetService.getInstance()

const FormSet: FC<Props> = ({ isOpenModal, paginateSets, setIsOpenModalSet, setSelected, setSetSelected }) => {
  const [initialValues, setInitialValues] = useState<ISet>({
    name: '',
    imagen: '',
    status: 1,
  })

  const [isLoader, setIsLoader] = useState<boolean>(false)

  const [imagenSelected, setImagenSelected] = useState<any>(null)

  const [base64, setBase64] = useState<any>(null)

  const [isErrorFile, setIsErrorFile] = useState<boolean>(false)

  const dataUser: IUserModel = useSelector((state: any) => state.user.data);

  const dispatch = useDispatch();

  // reset file
  const restFile = () => {
    setImagenSelected(null)
    setBase64(null)
  }

  // create set
  const createSet = async (values: ISet) => {

    setIsLoader(true)

    try {
      if (!imagenSelected && setSelected === null) {

        setIsErrorFile(true);

      } else {

        if(dataUser){

          const idImagenUpload = await handleSubmitFileUploadcare(imagenSelected)

          values.imagen = idImagenUpload;

          const responseHttp: IResponseHttp = await setService.saveSet(values, dataUser.accessToken);

          if (responseHttp.status === 201 && responseHttp.response) {

            const dataResponse: ISetModel = responseHttp.data;

            dispatch(addSet(dataResponse));

            setIsOpenModalSet(false);

            await paginateSets(1 );

            restFile();

            formik.resetForm();

            toast.success(responseHttp.message);

          } else {

            toast.error(responseHttp.message)
          }

        }

      }
    } catch (error: any) {
      toast.error(error.message);
      setIsOpenModalSet(false);
    }

    setIsLoader(false)
  }

  //update set
  const updateSet = async (values: ISet, idSet: string)=>{

    setIsLoader(true);

    try {

      if(dataUser){

        if(imagenSelected){

          const idImagenUpload = await handleSubmitFileUploadcare(imagenSelected);

          values.imagen = idImagenUpload;

        }

        const responseHttp : IResponseHttp = await setService.updateSetById(idSet, values, dataUser.accessToken);

        if (responseHttp.status === 200 && responseHttp.response) {

          const dataResponse: ISetModel = responseHttp.data;

          dispatch(setSet(dataResponse));

          setIsOpenModalSet(false);

          restFile();

          formik.resetForm();

          setSetSelected(null);

          toast.success(responseHttp.message);

        } else {

          toast.error(responseHttp.message);

        }

      }

    } catch (error: any) {

      toast.error(error.message);

    }

    setIsLoader(false);

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values: ISet) => {

      if(setSelected){

        await updateSet(values , setSelected._id);

      }else{

        await createSet(values);

      }
    },
  })

  // send form
  const sendForm = () => {

    if (!imagenSelected && setSelected === null ) {

      setIsErrorFile(true);

    }

    formik.submitForm();
  }

  useEffect(()=>{

    if(setSelected){

      setInitialValues({
        name: setSelected.name,
        status: setSelected.status ? 1: 0,
        imagen: setSelected.imagen
      })
    }

  },[setSelected]);

  useEffect(()=>{

    formik.setValues({...initialValues});

  },[initialValues]);

  const handleFormKeyPress = (e : KeyboardEvent) => {

    if (e.key === 'Enter' && isLoader === false) {

      e.stopPropagation();
      e.preventDefault();

      sendForm();

    }

  };

  useEffect(() => {

    window.addEventListener("keydown", handleFormKeyPress);

    return () => {
      window.removeEventListener("keydown", handleFormKeyPress);
    };

  }, [isOpenModal, isLoader , formik]);

  return (
    <CModal
      visible={isOpenModal}
      onClose={() => {
        setIsOpenModalSet(false)
        formik.resetForm()
        restFile();
        setSetSelected(null);
      }}
    >
      <CModalHeader>
        <CModalTitle>{setSelected ? "Editar colección": "Nueva colección"}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={formik.handleSubmit} className="row">
          <div className="mb-3">
            <CFormInput
              type="text"
              label="Nombre"
              placeholder="Nombre de la colección"
              {...formik.getFieldProps('name')}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                { 'is-valid': formik.touched.name && !formik.errors.name },
              )}
            />

            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormInput
              type="file"
              label="Imagen"
              accept="image/*"
              onChange={async (e) => {
                const files = e.target.files

                if (files && files[0]) {
                  const file = files[0];

                  const fileCompress = await compressImage(file);

                  const base64 = await convertFileToBase64(fileCompress);

                  setBase64(base64);

                  setImagenSelected(fileCompress);

                  setIsErrorFile(false);

                } else {

                  if(setSelected === null){

                    setIsErrorFile(true);

                  }

                  setImagenSelected(null)

                  setBase64(null)
                }
              }}
            />
            {isErrorFile ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput}}>
                    Se requiere la imagen
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>

          {base64 || setSelected?.imagen? (
            <div className="mb-3">
              <div>
                <CFormLabel className='fs-7'>{setSelected?.imagen && base64 == null ? "Imagen actual" : "Imagen seleccionada"}</CFormLabel>
              </div>
              <CImage rounded width={200} height={200} src={base64 ? base64 : setSelected?.imagen } />
            </div>
          ) : (
            ''
          )}

          <div className="mb-3">
            <CFormSelect
              label="Status"
              {...formik.getFieldProps('status')}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.status && formik.errors.status },
                { 'is-valid': formik.touched.status && !formik.errors.status },
              )}
              defaultValue={'1'}
              options={[
                { label: 'Inactivo', value: '0' },
                { label: 'Activo', value: '1' },
              ]}
            />
            {formik.touched.status && formik.errors.status && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton
          disabled={isLoader}
          onClick={() => {
            setIsOpenModalSet(false)
            formik.resetForm()
            restFile();
            setSetSelected(null);

          }}
          color="secondary"
        >
          Cerrar
        </CButton>
        <CButton
          disabled={isLoader}
          onClick={async (e) => {
            sendForm()
          }}
          color="primary"
        >
          {!isLoader && <span className="indicator-label">Guardar</span>}
          {isLoader && (
            <span className="indicator-progress" style={{ display: 'block' }}>
              Cargando...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default FormSet;
