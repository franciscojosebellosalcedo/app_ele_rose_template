import { cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
  CSpinner
} from '@coreui/react'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { CSSProperties, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as Yup from 'yup'
import Autocomplete from '../../../../components/AutoComplete'
import { addProduct, setProduct } from '../../../../features/product/productSlice'
import ContainerContent from '../../../../helpers/ContainerContent'
import {
  ICategoryModel,
  IColorModel,
  IDataInputSelect,
  IDataVariantModel,
  IProduct,
  IProductImagen,
  IProductModel,
  IResponseHttp,
  ISetModel,
  ISizeModel,
  ITypeVariantModel,
  IUserModel,
} from '../../../../models/models'
import {
  colorRedInfoInput,
  compressImage,
  convertFileToBase64,
  getOptionsInputSelect,
  handleSubmitFileUploadcare,
  stylesElementAbsolute,
} from '../../../../utils'
import FormCategory from '../../category/components/FormCategory'
import FormSet from '../../set/components/FormSet'
import { ProductService } from '../product.service'

const schemaValidation = Yup.object().shape({
  name: Yup.string().required('Se requiere el nombre del producto').min(5, 'Mínimo 5 caracteres')
  .test(
    'no-espacios-solo',
    'Se requiere el nombre del producto',
    (value) => value.trim().length > 0
  ),

  categoryId: Yup.string().required('Se require la categoría'),

  setId: Yup.string().optional(),

  amount: Yup.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .integer('La cantidad debe ser un número entero')
    .required('Se requiere la cantidad '),

  price: Yup.number()
    .min(0.1, 'El precio debe ser mayor a 0')
    .required('Se requiere el precio '),

  cost: Yup.number().min(0.1, 'El costo debe ser mayor a 0').required('Se requiere el costo '),

  status: Yup.number()
    .required('Se require el status')
    .test('is-number', 'Valor no válido', (value) => {
      if (Number.isInteger(value)) return true
      if (!value) return false
      return isNaN(value)
    }),

})

const productService: ProductService = ProductService.getInstance()

const FormProduct = () => {
  const [listImagen, setListImagen] = useState<any[]>([])

  const [listBase64, setListBase64] = useState<any[]>([])

  const [isLoaderImagens, setIsLoaderImagens] = useState<boolean>(false)

  const [isLoader, setIsLoader] = useState<boolean>(false)

  const categories: ICategoryModel[] = useSelector((state: any) => state.category.data.list)

  const sets: ISetModel[] = useSelector((state: any) => state.set.data.list)

  const typesVariants: ITypeVariantModel[] = useSelector(
    (state: any) => state.typeVariant.data.list,
  )

  const navigate = useNavigate()

  const [isErrorFiles, setIsErrorFiles] = useState<boolean>(false)

  const user: IUserModel = useSelector((state: any) => state.user.data)

  const dispatch = useDispatch()

  const [optionsSets, setOptionsSets] = useState<IDataInputSelect[]>([])

  const [optionsCategory, setOptionsCategories] = useState<any[]>([])

  const [isOpenModalCategory, setIsOpenModalCategory] = useState<boolean>(false)

  const [isOpenModalSet, setIsOpenModalSet] = useState<boolean>(false)

  const colors: IColorModel[] = useSelector((state: any) => state.color.data.list)

  const sizes: ISizeModel[] = useSelector((state: any) => state.size.data.list)

  const params = useParams();

  const [productFound , setProductFound] = useState<IProduct | null>(null);

  const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false);

  const [listRemovedImagens , setListRemovedImagens] = useState<string[]>([]);

  const [initialValues , setInitialValues] = useState<IProduct>({
    name: '',
    description: '',
    amount: 0,
    categoryId: '',
    cost: 0,
    existence: 0,
    price: 0,
    setId: '',
    status: 1,
    listImagen: [],
  })

  // hand ler list imagen
  const handlerListImagen = async (files: any) => {
    setIsLoaderImagens(true)

    if (files) {
      if (
        formik.values?.listImagen &&
        formik.values.listImagen.length === 0 &&
        listBase64.length === 0
      ) {
        setIsErrorFiles(false)
      }

      const listFiles: any[] = listImagen

      const listAux: any[] = listBase64

      const keys = Object.keys(files)

      for (let index = 0; index < keys.length; index++) {
        const file = files[index]

        if(file._id === undefined){

          const fileCompress = await compressImage(file)

          listFiles.push(fileCompress)

          const base64 = await convertFileToBase64(fileCompress)

          listAux.push(base64)

        }

      }

      setListImagen(listFiles)

      setListBase64(listAux)
    }

    setIsLoaderImagens(false)
  }

  // handler delete imagen
  const handleDeleteImage = (indexImagen: number) => {
    const imagenFound = listImagen[indexImagen];
    const listRemovedImagensAux = listRemovedImagens;

    if(imagenFound._id !== undefined && imagenFound._id !== null ){

      listRemovedImagensAux.push(imagenFound._id);

    }

    setListRemovedImagens([...listRemovedImagensAux]);

    setListBase64(listBase64.filter((_, i) => i !== indexImagen))
    setListImagen(listImagen.filter((_, i) => i !== indexImagen))
  }

  // create product
  const saveProduct = async (values: IProduct) => {
    setIsLoader(true)

    try {

      if (user && listBase64.length > 0) {
        let listImagenUploadcare: IProductImagen[] = []

        for (let index = 0; index < listImagen.length; index++) {

          const imagen = listImagen[index]

          if(imagen._id === undefined){

            const idUpload = await handleSubmitFileUploadcare(imagen)

            listImagenUploadcare.push({
              idUpload: idUpload,
              imagen: `https://ucarecdn.com/${idUpload}/`,
              product: '',
            })

          }

        }

        const responseHttp: IResponseHttp = await productService.saveProduct(
          { product: values, listImagen: listImagenUploadcare },
          user.accessToken,
        )

        if (responseHttp.status === 201 && responseHttp.response) {
          const dataResponse: IProductModel = responseHttp.data

          dispatch(addProduct(dataResponse))

          toast.success(responseHttp.message)

          navigate('/vending/product')
        }
      }

    } catch (error: any) {
      toast.error(error.message)
      navigate('/vending/product')
    }

    setIsLoader(false)
  }

  //update product by id
  const updateProductById = async (values: IProduct)=>{
    setIsLoader(true);

    try {

      const idProduct = params.id;

      if (user && listBase64.length > 0 && idProduct) {

        let listImagenUploadcare: IProductImagen[] = []

        for (let index = 0; index < listImagen.length; index++) {

          const imagen = listImagen[index]

          const bool = imagen._id === undefined;

          if(bool){

            const idUpload = await handleSubmitFileUploadcare(imagen)

            listImagenUploadcare.push({
              idUpload: idUpload,
              imagen: `https://ucarecdn.com/${idUpload}/`,
              product: '',
            })

          }

        }

        const responseHttp: IResponseHttp = await productService.updateProductById(
          idProduct,
          { product: values,
            listImagen: listImagenUploadcare ,
            listRemovedImagens: listRemovedImagens,
          },
          user.accessToken,
        )

        if (responseHttp.status === 200 && responseHttp.response) {
          const dataResponse: IProductModel = responseHttp.data

          dispatch(setProduct(dataResponse))

          toast.success(responseHttp.message)

          navigate('/vending/product')
        }
      }

    } catch (error : any) {

      toast.error(error.message);

    }

    setIsLoader(false);

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values: IProduct) => {

      if(params.id !== undefined && params.id !== null){

        await updateProductById(values);

      }else{

        await saveProduct(values);

      }

    },
  })

  // send form
  const sendForm = (e: any) => {
    e.preventDefault()

    if (
      formik.values?.listImagen &&
      formik.values.listImagen.length === 0 &&
      listBase64.length === 0
    ) {
      setIsErrorFiles(true);

    }

    formik.submitForm();

  }

  // get one product by id
  const getOneProductById = async ()=>{
    setIsLoaderGet(true);

    try {

      const idProduct  = params.id;

      if(idProduct && user.accessToken){

        const responseHttp : IResponseHttp = await productService.getProductById(idProduct , user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          const dataResponse : IProductModel = responseHttp.data;
          const { _id, createdAt, updatedAt, ...restData} = dataResponse;

          const data = {
            amount: restData.amount,
            categoryId: restData.categoryId,
            cost: restData.cost,
            description: restData.description,
            existence: restData.existence,
            name: restData.name,
            price: restData.price,
            setId: restData.setId,
            status: restData.status ? 1: 0,
            listImagen: restData.listImagen,
          }

          const listImagens = restData.listImagen ? restData.listImagen : [];

          const listAux = [];

          for (let index = 0; index < listImagens.length; index++) {
            const imagen = listImagens[index];
            listAux.push(imagen.imagen);
          }

          setListBase64(listAux);

          setListImagen(listImagens);

          setInitialValues(data);

          setProductFound(data);

        }
      }

    } catch (error : any) {

      toast.error(error.message);
      navigate("/vending/product");

    }

    setIsLoaderGet(false);

  }

  useEffect(() => {
    const optionsSets = getOptionsInputSelect(
      sets?.filter((set) => set.status === true),
      '_id',
      ['name'],
    )
    setOptionsSets(optionsSets)
  }, [sets])

  useEffect(() => {
    const optionscategories = getOptionsInputSelect(
      categories?.filter((cate) => cate.status === true),
      '_id',
      ['name'],
    )

    setOptionsCategories(optionscategories)
  }, [categories])

  useEffect(()=>{

    getOneProductById();

  },[user]);

  useEffect(()=>{

    if(initialValues){

      formik.setValues({...initialValues});
    }

  },[productFound, initialValues]);

  const handleFormKeyPress = (e : KeyboardEvent) => {

    if (e.key === 'Enter' && isLoader === false && isOpenModalCategory === false && isOpenModalSet === false) {

      e.stopPropagation();
      e.preventDefault();

      sendForm(e);

    }

  };

  useEffect(() => {

    window.addEventListener("keydown", handleFormKeyPress);

    return () => {
      window.removeEventListener("keydown", handleFormKeyPress);
    };

  }, [isOpenModalCategory , isOpenModalSet, isLoader , formik]);

  return (
    isLoaderGet ?
      <CSpinner color='primary' />
    :
    <ContainerContent title={params.id ? "Editar producto": "Nuevo producto"}>
      <FormCategory
        paginateCategories={() => {}}
        setCategorySelected={() => {}}
        categorySelected={null}
        setIsOpenModalCategory={setIsOpenModalCategory}
        isOpenModal={isOpenModalCategory}
      />

      <FormSet
        paginateSets={() => {}}
        setSetSelected={() => {}}
        setSelected={null}
        setIsOpenModalSet={setIsOpenModalSet}
        isOpenModal={isOpenModalSet}
      />

      <CForm onSubmit={formik.handleSubmit}>
        <CFormInput
          className="mb-4"
          type="file"
          multiple
          accept="image/*"
          label="Imagenes"
          onChange={(e) => {
            const files = e.target.files

            handlerListImagen(files)
          }}
        />
        {isErrorFiles ? (
          <>
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    Se requieren las imagenes
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          ''
        )}

        {isLoaderImagens ? (
          <CSpinner color="primary" />
        ) : (
          <div className="clearfix mb-4">
            {listBase64 && listBase64.length > 0 ? (
              <CRow>
                {listBase64.map((base64, index) => (
                  <CCol xs="12" sm="6" md="4" lg="3" className="mb-4" key={index}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <CButton
                        color="danger"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          zIndex: 1,
                          borderRadius: '50%',
                          padding: '0.3rem',
                        }}
                        onClick={() => handleDeleteImage(index)}
                      >
                        <CIcon icon={cilX} />
                      </CButton>
                      <CImage
                        rounded
                        src={base64}
                        width="100%"
                        height="auto"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </CCol>
                ))}
              </CRow>
            ) : (
              ''
            )}
          </div>
        )}

        <CRow className="mb-3">
          <CCol className="mb-4" md="6" xs="12">
            <CFormInput
              label="Nombre"
              placeholder="Nombre de producto"
              {...formik.getFieldProps('name')}
              value={formik.values.name}
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
          </CCol>

          <CCol className="mb-4" md="6" xs="12">
            <div style={{ position: 'relative' }}>
              <CButton
                onClick={() => setIsOpenModalSet(true)}
                title="Agregar colección"
                size="sm"
                style={stylesElementAbsolute}
              >
                <CIcon style={{ color: 'white' }} icon={cilPlus} />
              </CButton>
              <Autocomplete
                label='Colección (Opcional)'
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.setId && formik.errors.setId },
                  { 'is-valid': formik.touched.setId && !formik.errors.setId },
                )}
                options={[{ label: 'Seleccionar', value: '' }, ...optionsSets]}
                isLabelTitle
                defaultValue={formik.values.setId}
                onSelect={(selected)=>{

                  formik.setFieldValue("set", selected.value);

                }}
              />
            </div>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol className="mb-4" md="6" xs="12">
            <div style={{ position: 'relative' }}>
              <CButton
                onClick={() => setIsOpenModalCategory(true)}
                title="Agregar categoría"
                size="sm"
                style={stylesElementAbsolute}
              >
                <CIcon style={{ color: 'white' }} icon={cilPlus} />
              </CButton>
              <Autocomplete
                label='Categoría'
                className={clsx(
                  'form-select',
                  { 'is-invalid': formik.touched.categoryId && formik.errors.categoryId },
                  { 'is-valid': formik.touched.categoryId && !formik.errors.categoryId },
                )}
                options={[{ label: 'Seleccionar', value: '' }, ...optionsCategory]}
                isLabelTitle
                defaultValue={formik.values.categoryId}
                onSelect={(selected)=>{

                  formik.setFieldValue("categoryId", selected.value);

                }}
              />
            </div>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.categoryId}
                  </span>
                </div>
              </div>
            )}
          </CCol>

          <CCol className="mb-4" md="6" xs="12">
            <CFormInput
              type="number"
              label="Cantidad"
              placeholder="Cantidad de producto"
              {...formik.getFieldProps('amount')}
              value={formik.values.amount}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.amount && formik.errors.amount },
                { 'is-valid': formik.touched.amount && !formik.errors.amount },
              )}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.amount}
                  </span>
                </div>
              </div>
            )}
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol className="mb-4" md="6" xs="12">
            <CFormInput
              type="number"
              label="Precio"
              placeholder="Precio de producto"
              {...formik.getFieldProps('price')}
              value={formik.values.price}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.price && formik.errors.price },
                { 'is-valid': formik.touched.price && !formik.errors.price },
              )}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.price}
                  </span>
                </div>
              </div>
            )}
          </CCol>

          <CCol className="mb-4" md="6" xs="12">
            <CFormInput
              type="number"
              label="Costo"
              placeholder="Costo de producto"
              {...formik.getFieldProps('cost')}
              value={formik.values.cost}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.cost && formik.errors.cost },
                { 'is-valid': formik.touched.cost && !formik.errors.cost },
              )}
            />
            {formik.touched.cost && formik.errors.cost && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.cost}
                  </span>
                </div>
              </div>
            )}
          </CCol>

          <CCol className="mb-4">
            <CFormTextarea
              label="Descripción (Opcional)"
              rows={4}
              placeholder="Escribe la descripcion aquí..."
              {...formik.getFieldProps('description')}
              value={formik.values.description}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.description && formik.errors.description },
                { 'is-valid': formik.touched.description && !formik.errors.description },
              )}
            />
          </CCol>
        </CRow>

        <CCol className='mb-5'>
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
        </CCol>

        <div className="d-flex justify-content-end mb-4">
          <CButton
            className="me-4"
            onClick={() => navigate('/vending/product')}
            disabled={isLoader}
            color="secondary"
          >
            Cancelar
          </CButton>

          <CButton onClick={(e) => sendForm(e)} disabled={isLoader} color="primary">
            {!isLoader && <span className="indicator-label">Guardar</span>}
            {isLoader && (
              <span className="indicator-progress" style={{ display: 'block' }}>
                Cargando...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </CButton>
        </div>
      </CForm>
    </ContainerContent>
  )
}

export default FormProduct
