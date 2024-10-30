import { cilPlus, cilTrash, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CListGroupItem,
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
} from '../../../../utils'
import FormCategory from '../../category/components/FormCategory'
import FormSet from '../../set/components/FormSet'
import { ProductService } from '../product.service'

const schemaValidation = Yup.object().shape({
  name: Yup.string().required('Se requiere el nombre').min(5, 'Mínimo 5 caracteres'),

  category: Yup.string().required('Se require la categoría'),

  haveVariant: Yup.boolean().optional(),

  haveDiscount: Yup.boolean().optional(),

  amount: Yup.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .integer('La cantidad debe ser un número entero')
    .required('Se requiere la cantidad '),

  realPrice: Yup.number()
    .min(0.1, 'El precio debe ser mayor a 0')
    .required('Se requiere el precio '),

  pricePromotion: Yup.number()
  .optional()
  .min(0, 'El precio descuento no puede ser negativo')
  .test(
    'is-less-than-realPrice',
    'El precio descuento no puede ser mayor al precio real',
    function (value) {
      const { realPrice } = this.parent;
      return value === undefined || value <= realPrice;
    }
  ),


  percentage: Yup.number()
    .min(0, 'El porcentaje no puede ser negativo')
    .optional(),

  cost: Yup.number().min(0.1, 'El costo debe ser mayor a 0').required('Se requiere el costo '),

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

  const [optionsTypesVariants, setOptionsTypesVariants] = useState<IDataInputSelect[]>([])

  const [listOptionsValueVariant, setListOptionsValueVariant] = useState<IDataInputSelect[]>([])

  const colors: IColorModel[] = useSelector((state: any) => state.color.data.list)

  const sizes: ISizeModel[] = useSelector((state: any) => state.size.data.list)

  const [listVariantsProduct, setListVariantsProduct] = useState<IDataVariantModel[]>([
    { _id: '', amount: 0, product: '', typeVariant: '', valueVariant: '' },
    { _id: '', amount: 0, product: '', typeVariant: '', valueVariant: '' },
  ])

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const [isErrorTypeVariant , setIsErrorTypeVariant] = useState<boolean>(false);

  const params = useParams();

  const [productFound , setProductFound] = useState<IProduct | null>(null);

  const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false);

  const [listRemovedImagens , setListRemovedImagens] = useState<string[]>([]);

  const [listRemovedVariant, setListRemovedVariant] = useState<string[]>([]);

  const [initialValues , setInitialValues] = useState<IProduct>({
    name: '',
    description: '',
    amount: 0,
    available: 0,
    category: '',
    haveDiscount: false,
    cost: 0,
    existence: 0,
    haveVariant: false,
    percentage: 0,
    pricePromotion: 0,
    realPrice: 0,
    typeVariant: "",
    set: '',
    status: 1,
    listImagen: [],
    listVariants: [],
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

  // handler delete variant
  const handlerDeteleVariant = async (indexValue: number) => {
    try {
      if (!openConfirm) {
        toast(`¿ Desea eliminar esta variante?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              const listAux = listVariantsProduct;
              const listremovedVariantAux = listRemovedVariant;

              const variantFound = listAux[indexValue];

              if(variantFound._id){

                listremovedVariantAux.push(variantFound._id);

              }

              setListRemovedVariant([...listremovedVariantAux]);

              setListVariantsProduct([...listAux.filter((_, index) => index !== indexValue)])
              setOpenConfirm(false)
            },
          },

          cancel: {
            label: 'No',
            onClick: () => {
              setOpenConfirm(false)
            },
          },

          onAutoClose: () => {
            setOpenConfirm(false)
          },

          onDismiss: () => {
            setOpenConfirm(false)
          },
        })

        setOpenConfirm(true)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // add list delete variant
  const addListDeletevariant = ()=>{
    const listRemovedVariant = [];

    for (let index = 0; index < listVariantsProduct.length; index++) {
      const variant = listVariantsProduct[index];

      if( variant._id !== undefined && variant._id !== null ){
        listRemovedVariant.push(variant._id);
      }

    }

    setListRemovedVariant([...listRemovedVariant]);

  }

  // handler add new variant
  const handlerAddNewVariant = () => {
    const listAux = listVariantsProduct

    const newVariant: IDataVariantModel = {
      _id: '',
      amount: 0,
      product: '',
      typeVariant: '',
      valueVariant: '',
    }

    listAux.push(newVariant);

    setListVariantsProduct([...listAux])
  }

  // handler delete imagen
  const handleDelete = (indexImagen: number) => {
    const imagenFound = listImagen[indexImagen];
    const listRemovedImagensAux = listRemovedImagens;

    if(imagenFound._id !== undefined && imagenFound._id !== null ){

      listRemovedImagensAux.push(imagenFound._id);

    }

    setListRemovedImagens([...listRemovedImagensAux]);

    setListBase64(listBase64.filter((_, i) => i !== indexImagen))
    setListImagen(listImagen.filter((_, i) => i !== indexImagen))
  }

  //calculate sum amount variante and amount product
  const isAmountCorrect = ()=>{

    let amount = 0;

    for (let index = 0; index < listVariantsProduct.length; index++) {
      const variant = listVariantsProduct[index];
      amount += variant.amount;
    }

    return amount === formik.values.amount;

  }

  // create product
  const saveProduct = async (values: IProduct) => {
    setIsLoader(true)

    try {
      values.available = values.amount
      values.existence = values.amount

      const boolVaidationField = formik.values.haveVariant ===  true && formik.values.typeVariant === "";

      const boolValidation = formik.values.haveVariant && formik.values.typeVariant !== "";

      const validationListVariant = boolValidation && listVariantsProduct.some((variant) => variant.amount <= 0 || variant.valueVariant === "");

      if(boolVaidationField){

        setIsErrorTypeVariant(true);

      }else if(boolValidation && listVariantsProduct.length === 0){

        toast.info("Por favor agregue variantes");

      }else if(validationListVariant){

        toast.info("Hay campos por llenar en la variantes o valores");

      }else if(listVariantsProduct.some((variant) => variant.amount < 0)){

        toast.info("La cantidad de las variantes no puede ser cero ni negativo");

      }else if(!isAmountCorrect() && listVariantsProduct.length > 0 && boolValidation){

        toast.info("Ajuste las cantidades de las variantes a la cantidad del producto");

      }
      else{

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
            { product: values, listImagen: listImagenUploadcare , listVariants: formik.values.haveVariant ? listVariantsProduct : []},
            user.accessToken,
          )

          if (responseHttp.status === 201 && responseHttp.response) {
            const dataResponse: IProductModel = responseHttp.data

            dispatch(addProduct(dataResponse))

            toast.success(responseHttp.message)

            navigate('/vending/product')
          }
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

      values.available = values.amount
      values.existence = values.amount

      const boolVaidationField = formik.values.haveVariant ===  true && formik.values.typeVariant === "";

      const boolValidation = formik.values.haveVariant && formik.values.typeVariant !== "";

      const validationListVariant = boolValidation && listVariantsProduct.some((variant) => variant.amount <= 0 || variant.valueVariant === "");

      if(boolVaidationField){

        setIsErrorTypeVariant(true);

      }else if(boolValidation && listVariantsProduct.length === 0){

        toast.info("Por favor agregue variantes");

      }else if(validationListVariant){

        toast.info("Hay campos por llenar en la variantes");

      }else if(listVariantsProduct.some((variant) => variant.amount < 0)){

        toast.info("La cantidad de las variantes no puede ser cero ni negativo");

      }else if(!isAmountCorrect() && listVariantsProduct.length > 0 && boolValidation){

        toast.info("Ajuste las cantidades de las variantes a la cantidad del producto");

      }else{

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
              listVariants: formik.values.haveVariant ? listVariantsProduct : [],
              listRemovedImagens: listRemovedImagens,
              listRemovedVariants: listRemovedVariant
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
  const sendForm = (e: React.MouseEvent) => {
    e.preventDefault()

    if (
      formik.values?.listImagen &&
      formik.values.listImagen.length === 0 &&
      listBase64.length === 0
    ) {
      setIsErrorFiles(true);

    }
    if(formik.values.haveVariant === true && formik.values.typeVariant === ""){

      setIsErrorTypeVariant(true);

    }

    formik.submitForm()
  }

  const stylesElementAbsolute: CSSProperties = {
    position: 'absolute',
    top: 14,
    right: -8,
    height: 28,
    width: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: '#3498db',
  }

  // calculate price promotion
  const calculatePricePromotion = (percentage: number) => {

    if(formik.values.haveDiscount === false){

      formik.setFieldValue("pricePromotion", 0);

    }else{

      if(formik.values.realPrice > 0 ){

        const pricePromotion = formik.values.realPrice - (formik.values.realPrice * (percentage / 100));

        formik.setFieldValue("pricePromotion", parseFloat(pricePromotion.toFixed(2)));

      }

    }

  }

  // calculate percentaje
  const calculatePercentage = (pricePromotion: number) => {

    if(formik.values.haveDiscount === false){

    formik.setFieldValue("percentage", 0);

    }else{

      if(formik.values.realPrice > 0){

        const percentage = ((formik.values.realPrice - pricePromotion) / formik.values.realPrice) * 100

        formik.setFieldValue("percentage", parseFloat(percentage.toFixed(2)));

      }

    }

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
            available: restData.available,
            category: restData.category,
            cost: restData.cost,
            description: restData.description,
            existence: restData.existence,
            haveDiscount: restData.haveDiscount,
            haveVariant: restData.haveVariant,
            name: restData.name,
            percentage: restData.percentage,
            pricePromotion: restData.pricePromotion,
            realPrice: restData.realPrice,
            set: restData.set,
            status: restData.status ? 1: 0,
            typeVariant: restData.typeVariant,
            listImagen: restData.listImagen,
            listVariants: restData.listVariants
          }

          const listVariants = restData.listVariants ? restData.listVariants : [];

          const listImagens = restData.listImagen ? restData.listImagen : [];

          const listAux = [];

          for (let index = 0; index < listImagens.length; index++) {
            const imagen = listImagens[index];
            listAux.push(imagen.imagen);
          }

          setListVariantsProduct([...listVariants]);

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

  useEffect(() => {
    const optionsTypeVariant = getOptionsInputSelect(
      typesVariants?.filter((typeVariant) => typeVariant.status === true),
      '_id',
      ['name'],
    )

    setOptionsTypesVariants(optionsTypeVariant)
  }, [typesVariants])


  useEffect(()=>{

    getOneProductById();

  },[user]);

  useEffect(()=>{

    if(initialValues){

      formik.setValues({...initialValues});
    }

  },[productFound, initialValues]);

  useEffect(() => {
    const typeVariantFound = typesVariants.find(
      (typeVariant) => typeVariant.status === true && typeVariant._id === formik.values.typeVariant,
    )
    if (typeVariantFound?.name === 'Color') {
      const optionsValueItemsVariants = getOptionsInputSelect(
        colors.filter((color) => color.status === true),
        '_id',
        ['name'],
      )
      setListOptionsValueVariant(optionsValueItemsVariants)
    } else if (typeVariantFound?.name === 'Talla') {
      const optionsValueItemsVariants = getOptionsInputSelect(
        sizes.filter((size) => size.status === true),
        '_id',
        ['name'],
      )
      setListOptionsValueVariant(optionsValueItemsVariants)
    }
  }, [formik.values.typeVariant]);

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
                        onClick={() => handleDelete(index)}
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
              <CFormSelect
                label="Colección (Opcional)"
                {...formik.getFieldProps('set')}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.set && formik.errors.set },
                  { 'is-valid': formik.touched.set && !formik.errors.set },
                )}
                defaultValue={formik.values.set}
                options={[{ label: 'Seleccionar', value: '' }, ...optionsSets]}
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
              <CFormSelect
                label="Categoría"
                defaultValue={formik.values.category}
                {...formik.getFieldProps('category')}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.category && formik.errors.category },
                  { 'is-valid': formik.touched.category && !formik.errors.category },
                )}
                options={[{ label: 'Seleccionar', value: '' }, ...optionsCategory]}
              />
            </div>
            {formik.touched.category && formik.errors.category && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.category}
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
              {...formik.getFieldProps('realPrice')}
              value={formik.values.realPrice}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.realPrice && formik.errors.realPrice },
                { 'is-valid': formik.touched.realPrice && !formik.errors.realPrice },
              )}
            />
            {formik.touched.realPrice && formik.errors.realPrice && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.realPrice}
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

        <CFormCheck
          className="mb-4"
          label="¿Este producto tiene variante? (Opcional)"
          checked={formik.values.haveVariant}
          onChange={(e) => {
            const value: boolean = e.target.checked;

            if (value === false) {

              addListDeletevariant();

              setIsErrorTypeVariant(false);

              formik.setFieldValue("typeVariant", "");
              setListOptionsValueVariant([]);
              setListVariantsProduct([
                { _id: '', amount: 0, product: '', typeVariant: '', valueVariant: '' },
                { _id: '', amount: 0, product: '', typeVariant: '', valueVariant: '' },
              ]);

            }else{

              setListRemovedVariant([]);

            }

            formik.setFieldValue('haveVariant', value);

          }}
        />
        {formik.values.haveVariant ? (
          <>
            <CFormSelect
              label="Tipo de variante"
              className="mb-4"
              defaultValue={formik.values.typeVariant}
              onChange={(e) => {
                const value: string = e.target.value;
                formik.setFieldValue("typeVariant", value);

                if(value !== "" && formik.values.haveVariant){

                  setIsErrorTypeVariant(false);

                }else if(value === "" && formik.values.haveVariant){

                  setIsErrorTypeVariant(true);

                }

                const listAux = listVariantsProduct.map((item) => ({
                  ...item,
                  valueVariant: '',
                  typeVariant: value,
                }))

                setListVariantsProduct(listAux)
              }}
              options={[{ label: 'Seleccionar', value: '' }, ...optionsTypesVariants]}
            />
            {isErrorTypeVariant === true &&  (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    Se requiere tipo de variante
                  </span>
                </div>
              </div>
            )}
          </>

        ) : (
          ''
        )}

        {formik.values.haveVariant && formik.values.typeVariant ? (
          <div className='mb-4'
          >
            <div
              className='mb-3'
              style={{display:"flex", alignItems: "center", justifyContent: "space-between"}}
            >

            <h6 className='mt-3'>Variantes</h6>
            <CButton
              onClick={()=>{
                handlerAddNewVariant();
              }}
              title='Agregar variante'
              size='sm'
              color='primary'
              style={{borderRadius: "50%", cursor: "pointer",}}
            >
              <CIcon style={{color: "white"}} icon={cilPlus}
              />
            </CButton>
            </div>
            {listVariantsProduct.map((variant: IDataVariantModel, index: number) => (
              <CListGroupItem
                key={index}
                className="d-flex align-item-center justify-content-center gap-4 mb-3"
              >
                <CFormSelect
                  options={[{ label: 'Seleccionar', value: '' }, ...listOptionsValueVariant]}
                  value={variant.valueVariant.length > 0 ? variant.valueVariant : ''}
                  onChange={(e) => {
                    const value = e.target.value

                    const listAux = [...listVariantsProduct]
                    listAux[index].valueVariant = value

                    setListVariantsProduct(listAux)
                  }}
                />
                <CFormInput
                  onKeyPress={(e) => {
                    if (e.key === '.' || e.key === ',' || e.key === '-' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                type="number" placeholder="Cantidad" defaultValue={variant.amount}
                  onChange={(e)=>{

                    let value = parseInt(e.target.value);

                    if(isNaN(value)){
                      value = 0;
                    }

                    const listAux = [...listVariantsProduct]
                    listAux[index].amount = value

                    setListVariantsProduct(listAux)
                  }}
                />
                <CButton
                  onClick={() => {
                    handlerDeteleVariant(index)
                  }}
                  title="Eliminar variante"
                  size="sm"
                  color="danger"
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                >
                  <CIcon style={{ color: 'white' }} icon={cilTrash} />
                </CButton>
              </CListGroupItem>
            ))}
          </div>
        ) : (
          ''
        )}

        <CFormCheck
          className="mb-4"
          label="¿Este producto tiene descuento? (Opcional)"
          checked={formik.values.haveDiscount}
          onChange={(e) => {
            const value: boolean = e.target.checked;

            if(value === false){
              formik.setFieldValue("pricePromotion", 0);
              formik.setFieldValue("percentage", 0);
            }

            formik.setFieldValue("haveDiscount", value);
          }}
        />

        {
          formik.values.haveDiscount ?
          <CRow className="mb-3">
            <CCol className="mb-4" md="6" xs="12">
              <CFormInput
                type="number"
                label="Precio descuento"
                placeholder="Precio descuento"
                onChange={(e)=>{

                  let value = e.target.value;

                  if(isNaN(parseInt(e.target.value))){

                    formik.setFieldValue("pricePromotion", value);

                  }

                  calculatePercentage(parseInt(value));

                  formik.setFieldValue("pricePromotion", value);
                }}
                value={formik.values.pricePromotion}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.pricePromotion && formik.errors.pricePromotion },
                  { 'is-valid': formik.touched.pricePromotion && !formik.errors.pricePromotion },
                )}
              />
              {formik.touched.pricePromotion && formik.errors.pricePromotion && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" style={{ color: colorRedInfoInput }}>
                      {formik.errors.pricePromotion}
                    </span>
                  </div>
                </div>
              )}
            </CCol>

            <CCol className="mb-4" md="6" xs="12">
              <CFormInput
                type="number"
                label="Porcentaje"
                placeholder="Porcentaje"
                onChange={(e)=>{

                  let value = e.target.value;

                  if(isNaN(parseInt(e.target.value))){

                    formik.setFieldValue("percentage", value);

                  }

                  calculatePricePromotion(parseInt(value));

                  formik.setFieldValue("percentage", value);
                }}
                value={formik.values.percentage}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.percentage && formik.errors.percentage },
                  { 'is-valid': formik.touched.percentage && !formik.errors.percentage },
                )}
              />
              {formik.touched.percentage && formik.errors.percentage && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" style={{ color: colorRedInfoInput }}>
                      {formik.errors.percentage}
                    </span>
                  </div>
                </div>
              )}
            </CCol>

          </CRow>
          : ""
        }

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
