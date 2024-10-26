import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CForm, CFormInput, CFormSelect, CFormTextarea, CImage, CRow, CSpinner } from '@coreui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerContent from '../../../../helpers/ContainerContent';
import { colorRedInfoInput, convertFileToBase64, getOptionsInputSelect, handleSubmitFileUploadcare } from '../../../../utils';
import { ICategoryModel, IDataInputSelect, IProduct, IProductImagen, IProductModel, IResponseHttp, ISetModel, IUserModel } from '../../../../models/models';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'sonner';
import clsx from 'clsx';
import { ProductService } from '../product.service';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../../features/product/productSlice';

const initialValues : IProduct ={
  name: "",
  description: "",
  amount: 0,
  available: 0,
  category: "",
  cost: 0,
  existence: 0,
  haveVariant: false,
  percentage: 0,
  pricePromotion: 0,
  realPrice: 0,
  set: "",
  status: 1,
  typeVariant: "",
  listImagen: []

}

const schemaValidation = Yup.object().shape({

  name: Yup.string().required('Se requiere el nombre').min(5, 'Mínimo 5 caracteres'),

  category: Yup.string()
    .required('Se require la categoría'),

  amount: Yup.number()
  .min(1, 'La cantidad debe ser mayor a 0')
  .integer('La cantidad debe ser un número entero')
  .required('Se requiere la cantidad '),

  realPrice: Yup.number()
  .min(0.1, 'El precio debe ser mayor a 0')
  .required('Se requiere el precio '),

  cost: Yup.number()
  .min(0.1, 'El costo debe ser mayor a 0')
  .required('Se requiere el costo '),

});

const productService : ProductService = ProductService.getInstance();

const FormProduct = () => {

  const [listImagen , setListImagen] = useState<any[]>([]);

  const [listBase64 , setListBase64] = useState<any[]>([]);

  const [isLoaderImagens , setIsLoaderImagens] = useState<boolean>(false);

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const categories : ICategoryModel[] = useSelector((state: any) => state.category.data.list);

  const sets : ISetModel[ ] = useSelector((state: any) => state.set.data.list);

  const navigate = useNavigate();

  const [isErrorFiles , setIsErrorFiles] = useState<boolean>(false);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const dispatch = useDispatch();

  const [optionsSets , setOptionsSets] = useState<any[]>([]);

  const [optionsCategory , setOptionsCategories] = useState<any[]>([]);

  // hand ler list imagen
  const handlerListImagen = async ( files: any  )=>{

    setIsLoaderImagens(true);

    if(files){

      if(formik.values?.listImagen && formik.values.listImagen.length === 0 && listBase64.length === 0){

        setIsErrorFiles(false);

      }


      const listFiles : any[] = [];

      const listAux : any[] = [];

      const keys = Object.keys(files);

      for (let index = 0; index < keys.length; index++) {

        const file =  files[index];

        listFiles.push(file);

        const base64 = await convertFileToBase64(file);

        listAux.push(base64);

      }

      setListImagen(listFiles);

      setListBase64(listAux);

    }

    setIsLoaderImagens(false);

  }

  // handler delete imagen
  const handleDelete = (indexImagen: number) =>{

    setListBase64(listBase64.filter((_, i) => i !== indexImagen));
    setListImagen(listImagen.filter((_, i) => i !== indexImagen));

  }

  // create product
  const saveProduct = async (values: IProduct)=>{

    setIsLoader(true);

    try {

      values.available = values.amount;
      values.existence = values.amount;

      if(user && listBase64.length > 0){

        let listImagenUploadcare : IProductImagen[]= [];

        for (let index = 0; index < listImagen.length; index++) {
          const imagen = listImagen[index];
          const idUpload = await handleSubmitFileUploadcare(imagen);

          listImagenUploadcare.push({
            idUpload: idUpload,
            imagen: `https://ucarecdn.com/${idUpload}/`,
            product: ""
          });

        }

        const responseHttp : IResponseHttp = await productService.saveProduct({product: values , listImagen: listImagenUploadcare} , user.accessToken);

        if(responseHttp.status === 201 && responseHttp.response){

          const dataResponse : IProductModel = responseHttp.data;

          dispatch(addProduct(dataResponse));

          toast.success(responseHttp.message);

          navigate("/vending/product");

        }

      }


    } catch (error : any) {

      toast.error(error.message);
      navigate("/vending/product");

    }

    setIsLoader(false);

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values : IProduct)=>{

      await saveProduct(values);

    }
  });

  // send form
  const sendForm = (e: React.MouseEvent)=>{

    e.preventDefault();

    if(formik.values?.listImagen && formik.values.listImagen.length  === 0 && listBase64.length === 0){

      setIsErrorFiles(true);

    }

    formik.submitForm();

  }

  useEffect(()=>{

    const optionsSets = getOptionsInputSelect(sets?.filter((set)=> set.status === true) , "_id", ["name"]);
    setOptionsSets(optionsSets);

  },[sets]);

  useEffect(()=>{

    const optionscategories = getOptionsInputSelect(categories?.filter((cate)=> cate.status === true) , "_id", ["name"]);

    setOptionsCategories(optionscategories);

  },[categories]);

  return (
    <ContainerContent title="Nuevo producto">
      <CForm onSubmit={formik.handleSubmit}>

        <CFormInput
          className='mb-4'
          type='file'
          multiple
          accept='imagen/*'
          label="Imagenes"

          onChange={(e)=>{

            const files = e.target.files;

            handlerListImagen(files);

          }}
        />
        {
          isErrorFiles ?
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
          : ""
        }

        {
          isLoaderImagens ?
            <CSpinner color='primary' />
          :
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
              ""
            )}
          </div>
        }

        <CRow className="mb-3">

          <CCol className="mb-4" md="6" xs="12">
              <CFormInput label="Nombre" placeholder="Nombre de producto"
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
              <CFormSelect label="Colección (Opcional)"
                {...formik.getFieldProps('set')}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.set && formik.errors.set },
                  { 'is-valid': formik.touched.set && !formik.errors.set },
                )}
                defaultValue={formik.values.set}
                options={[
                  { label: "Seleccionar", value: ""},
                  ...optionsSets
                ]}
                />
          </CCol>

        </CRow>

        <CRow className="mb-3">

          <CCol className="mb-4" md="6" xs="12">
              <CFormSelect label="Categoría"
                defaultValue={formik.values.category}
                {...formik.getFieldProps('category')}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.category && formik.errors.category },
                  { 'is-valid': formik.touched.category && !formik.errors.category },
                )}
                options={[
                  { label: "Seleccionar", value: ""},
                  ...optionsCategory
                ]}
              />
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
              <CFormInput type='number' label="Cantidad" placeholder="Cantidad de producto"
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
              <CFormInput type='number' label="Precio" placeholder="Precio de producto"
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
              <CFormInput type='number' label="Costo" placeholder="Costo de producto"
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

          <CCol className="mb-4" >
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

        <div className="d-flex justify-content-end mb-4">
          <CButton className='me-4' onClick={()=>navigate("/vending/product")} disabled={isLoader}  color='secondary' >
            Cancelar
          </CButton>

          <CButton onClick={(e)=>sendForm(e)} disabled={isLoader}  color='primary' >
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
