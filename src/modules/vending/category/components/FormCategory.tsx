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
import { FC, ReactEventHandler, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { ICategory, ICategoryModel, IResponseHttp, IUserModel } from '../../../../models/models'
import { colorRedInfoInput, compressImage, convertFileToBase64, handleSubmitFileUploadcare } from '../../../../utils'
import { CategoryService } from '../category.service'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addCategory, setCategory } from '../../../../features/category/categorySlice'

type Props = {
  isOpenModal: boolean
  setIsOpenModalCategory: Function
  categorySelected: ICategoryModel | null
  setCategorySelected: Function
  paginateCategories: Function
}

const schemaValidation = Yup.object().shape({
  name: Yup.string().required('Se requiere el nombre de la categoría').min(5, 'Mínimo 5 caracteres')
  .test(
    'no-espacios-solo',
    'Se requiere el nombre de la categoría',
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

const categoryService: CategoryService = CategoryService.getInstance()

const FormCategory: FC<Props> = ({ isOpenModal, paginateCategories, setIsOpenModalCategory, categorySelected, setCategorySelected }) => {
  const [initialValues, setInitialValues] = useState<ICategory>({
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

  // create category
  const createCategory = async (values: ICategory) => {

    setIsLoader(true)

    try {
      if (!imagenSelected && categorySelected === null) {

        setIsErrorFile(true);

      } else {

        if(dataUser){

          const idImagenUpload = await handleSubmitFileUploadcare(imagenSelected)

          values.imagen = idImagenUpload;

          const responseHttp: IResponseHttp = await categoryService.saveCategory(values, dataUser.accessToken);

          if (responseHttp.status === 201 && responseHttp.response) {

            const dataResponse: ICategoryModel = responseHttp.data;

            dispatch(addCategory(dataResponse));

            setIsOpenModalCategory(false);

            await paginateCategories(1 );

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
      setIsOpenModalCategory(false);
    }

    setIsLoader(false)
  }

  //update category
  const updateCategory = async (values: ICategory, idCategory: string)=>{

    setIsLoader(true);

    try {

      if(dataUser){

        if(imagenSelected){

          const idImagenUpload = await handleSubmitFileUploadcare(imagenSelected);

          values.imagen = idImagenUpload;

        }

        const responseHttp : IResponseHttp = await categoryService.updateCategoryById(idCategory, values, dataUser.accessToken);

        if (responseHttp.status === 200 && responseHttp.response) {

          const dataResponse: ICategoryModel = responseHttp.data;

          dispatch(setCategory(dataResponse));

          setIsOpenModalCategory(false);

          restFile();

          formik.resetForm();

          setCategorySelected(null);

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
    onSubmit: async (values: ICategory) => {

      if(categorySelected){

        await updateCategory(values , categorySelected._id);

      }else{

        await createCategory(values);

      }
    },
  })

  // send form
  const sendForm = () => {

    if (!imagenSelected && categorySelected === null ) {

      setIsErrorFile(true);

    }

    formik.submitForm();
  }

  useEffect(()=>{

    if(categorySelected){

      setInitialValues({
        name: categorySelected.name,
        status: categorySelected.status ? 1: 0,
        imagen: categorySelected.imagen
      })
    }

  },[categorySelected]);

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
        setIsOpenModalCategory(false)
        formik.resetForm()
        restFile();
        setCategorySelected(null);
      }}
    >
      <CModalHeader>
        <CModalTitle>{categorySelected ? "Editar categoría": "Nueva categoría"}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={formik.handleSubmit} className="row">
          <div className="mb-3">
            <CFormInput
              type="text"
              label="Nombre"
              placeholder="Nombre de la categoría"
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

                  const base64 = await convertFileToBase64(fileCompress)

                  setBase64(base64)

                  setImagenSelected(fileCompress)

                  setIsErrorFile(false)

                } else {

                  if(categorySelected === null){

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
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    Se requiere la imagen
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>

          {base64 || categorySelected?.imagen? (
            <div className="mb-3">
              <div>
                <CFormLabel className='fs-7'>{categorySelected?.imagen && base64 == null ? "Imagen actual" : "Imagen seleccionada"}</CFormLabel>
              </div>
              <CImage rounded width={200} height={200} src={base64 ? base64 : categorySelected?.imagen } />
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
            setIsOpenModalCategory(false)
            formik.resetForm()
            restFile();
            setCategorySelected(null);

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

export default FormCategory
