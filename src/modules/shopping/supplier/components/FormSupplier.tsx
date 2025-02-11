import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow, CSpinner } from "@coreui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { ORDER_ADDRESS_ENTITY } from "../../../../config";
import TableAddress from "../../../../global/components/TableAddress";
import ContainerContent from "../../../../helpers/ContainerContent";
import { IAddresModel, IDataInputSelect, IResponseHttp, ISupplier, ISupplierModel, ITypeSupplierModel, IUserModel } from "../../../../models/models";
import { colorRedInfoInput, getOptionsInputSelect, stylesElementAbsolute } from "../../../../utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import FormTypeSupplier from "../../../../global/components/FormTypeSupplier";
import { SupplierService } from "../supplier.service";
import { AddressService } from "../../../../global/services/address.service";

const initialValues : ISupplier  = {
  name: "",
  phone: "",
  typeId: "",
  email: "",
  status: 1
};

const schemaValidation = Yup.object().shape({

  name: Yup.string()
  .required("Se requiere nombre del proveedor")
  .test(
    'no-espacios-solo',
    'Se requiere el nombre del proveedor',
    (value) => value.trim().length > 0
  )
  .min(3, "Mínimo 3 caracteres"),

  email: Yup.string()
  .optional()
  .email("Email no válido"),

  phone: Yup.string()
  .required("Se requiere télefono del proveedor")
  .min(10, "Mínimo 10 caracteres")
  .matches(/^\d+$/, "El teléfono solo debe contener números")
  .max(10, "Máximo 10 caracteres"),

  typeId: Yup.string().required('Se require el tipo de proveedor'),

  status: Yup.number()
  .required('Se require el status')
  .test('is-number', 'Valor no válido', (value) => {
    if (Number.isInteger(value)) return true
    if (!value) return false
    return isNaN(value)
  }),

});

const supplierService : SupplierService = SupplierService.getInstance();

const addressService : AddressService = AddressService.getInstance();

const FormSupplier = () => {

  const typesSuppliers : ITypeSupplierModel[] = useSelector( (state : any) => state.typeSupplier.data.list);

  const [isLoaderGet , setIsLoaderGet] = useState(false);

  const [listAddress , setListAddress] = useState<IAddresModel[]>([]);

  const [isOpenModalAddress , setIsOpenModalAddress] = useState(false);

  const [isLoader , setIsLoader] = useState(false);

  const params = useParams();

  const navigate = useNavigate();

  const [optionsTypesSuppliers , setOptionsTypesSuppliers] = useState<IDataInputSelect[]>([]);

  const [isOpenModalTypeSupplier , setIsOpenModalTypeSupplier] = useState(false);

  const user : IUserModel = useSelector( (state : any) => state.user.data);

  // set _id supplier all address
  const getIdSupplierCreatedAllAddress = (idSupplier : string ) =>{

    const listAux = listAddress;

    for (let index = 0; index < listAux.length; index++) {

      const itemAddress = listAux[index];
      itemAddress.entityId = idSupplier;

    }

    return listAux;

  }

  // get all address by _id supplier and entity
  const getAllAddressByIdSupplier = async (idSupplier : string) =>{
    try {

      if(user.accessToken){

        const responseHttp : IResponseHttp = await addressService.getAllAddressByEntityAndEntityId( ORDER_ADDRESS_ENTITY.supplier , idSupplier , user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          const dataResponse : IAddresModel[] = responseHttp.data;
          setListAddress([...dataResponse]);

        }
      }

    } catch (error) {

      setListAddress([]);

    }

  }

  // get supplier by id
  const getSupplierById = async (idSupplier : string | undefined) =>{

    setIsLoaderGet(true);

    try {

      if(user.accessToken && idSupplier){

        const responseHttp : IResponseHttp = await supplierService.getSupplierById(idSupplier , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const dataResponse : ISupplierModel = responseHttp.data;

          const { _id , createdAt , updatedAt, ...restData} = dataResponse;

          formik.setValues({
            ...restData,
            status: restData.status ? 1 : 0
          });

          // get all address supplier
          await getAllAddressByIdSupplier(_id);

        }
      }

    } catch (error : any ) {

      toast.error( error.message );
      navigate("/shopping/supplier");

    }

    setIsLoaderGet(false);

  }

  // create supplier
  const createSupplier = async (values : ISupplier) =>{

    setIsLoader(true);

    try {

      if(user.accessToken){

        const responseHttp : IResponseHttp = await supplierService.createSupplier( values , user.accessToken);

        if(responseHttp.status === 201 && responseHttp.response){

          if(listAddress.length > 0){

            const dataResponse : ISupplierModel = responseHttp.data;

            // create address suppliers
            const allAddressWithIdSupplierCreated = getIdSupplierCreatedAllAddress(dataResponse._id);

            await addressService.saveListAddress(allAddressWithIdSupplierCreated , user.accessToken);

          }

          toast.success( responseHttp.message );

          navigate("/shopping/supplier");

        }

      }

    } catch (error : any ) {

      toast.error( error.message );
      navigate("/shopping/supplier");

    }

    setIsLoader(false);

  }

  // update supplier
  const updateSupplier = async ( idSupplier: string , values : ISupplier) =>{

    setIsLoader(true);

    try {

      if(user.accessToken && idSupplier){

        const responseHttp : IResponseHttp = await supplierService.updateSupplierById(  idSupplier , values , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          if(listAddress.length > 0){

            const dataResponse : ISupplierModel = responseHttp.data;

            // create address suppliers
            const allAddressWithIdSupplierCreated = getIdSupplierCreatedAllAddress(dataResponse._id);

            await addressService.saveListAddress(allAddressWithIdSupplierCreated , user.accessToken);

          }

          toast.success( responseHttp.message );

          navigate("/shopping/supplier");

        }

      }

    } catch (error : any ) {

      toast.error( error.message );
      navigate("/shopping/supplier");

    }

    setIsLoader(false);

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async ( values : ISupplier ) =>{

      if(!params.id){

        await createSupplier(values);

      }else{

        if(params.id){

          await updateSupplier(params.id, values);

        }

      }

    }
  });

  // send form
  const sendForm = () =>{

    formik.submitForm();

  }

  const handleFormKeyPress = (e : KeyboardEvent) => {

    if (e.key === 'Enter' && isLoader === false && isOpenModalAddress === false && isOpenModalTypeSupplier === false ) {

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

  }, [isOpenModalAddress , isOpenModalTypeSupplier, listAddress, isLoaderGet , isLoader , formik]);

  useEffect(()=>{

    const optionsSupplier = getOptionsInputSelect( typesSuppliers.filter( (typeSupplier) => typeSupplier.status === true) , "_id", ["name"]);
    setOptionsTypesSuppliers(optionsSupplier);

  },[typesSuppliers]);

  useEffect(() =>{

    getSupplierById(params.id);

  },[params.id]);

  return (
    isLoaderGet ?

      <CSpinner color="primary"/>

    :
    <ContainerContent title={params.id ? "Editar proveedor": "Nuevo proveedor"}>

      <FormTypeSupplier
        isOpenModal = {isOpenModalTypeSupplier}
        setIsOpenModalTypeSupplier={ setIsOpenModalTypeSupplier }
      />

      <CForm>

        <CRow className="mb-3">

          <CCol className="mb-4" md="6" xs="12">

            <CFormInput
              label="Nombre"
              placeholder="Nombre de proveedor"
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

            <CFormInput
              label="Télefono"
              placeholder="Télefono de proveedor"
              {...formik.getFieldProps('phone')}
              value={formik.values.phone}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.phone && formik.errors.phone },
                { 'is-valid': formik.touched.phone && !formik.errors.phone },
              )}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.phone}
                  </span>
                </div>
              </div>
            )}

          </CCol>

          <CCol className="mb-4" md="6" xs="12">

            <CFormInput
              label="Email (Opcional)"
              placeholder="Email de proveedor"
              {...formik.getFieldProps('email')}
              value={formik.values.email}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                { 'is-valid': formik.touched.email && !formik.errors.email },
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.email}
                  </span>
                </div>
              </div>
            )}

          </CCol>

          <CCol className="mb-4" md="6" xs="12">
            <div style={{ position: "relative"}}>
              <CButton
                onClick={() => {

                  setIsOpenModalTypeSupplier(true);

                }}
                title="Agregar tipo de proveedor"
                size="sm"
                style={stylesElementAbsolute}
              >
                <CIcon style={{ color: 'white' }} icon={cilPlus} />
              </CButton>
            </div>
            <CFormSelect
              label="Tipo de proveedor"
              {...formik.getFieldProps('typeId')}
              className={clsx(
                'form-control',
                { 'is-invalid': formik.touched.typeId && formik.errors.typeId },
                { 'is-valid': formik.touched.typeId && !formik.errors.typeId },
              )}
              defaultValue={ formik.values.typeId}
              options={[
                { label: 'Seleccionar', value: '' },
                ...optionsTypesSuppliers
              ]}
            />
            {formik.touched.typeId && formik.errors.typeId && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.typeId}
                  </span>
                </div>
              </div>
            )}
          </CCol>

          <CCol className="mb-4" md="6" xs="12">

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

        </CRow>

        <hr />

        <TableAddress
          isOpenModal = { isOpenModalAddress }
          setIsOpenModal={ setIsOpenModalAddress}
          isOptional = { true }
          entity={ORDER_ADDRESS_ENTITY.supplier}
          listAddress={listAddress}
          setListAddress={setListAddress}
        />

        <div className="d-flex justify-content-end mb-4 mt-2">
          <CButton
            className="me-4"
            onClick={() => navigate('/shopping/supplier')}
            disabled={isLoader}
            color="secondary"
          >
            Cancelar
          </CButton>

          <CButton onClick={(e) => {

            sendForm();

          }} disabled={isLoader} color="primary">
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

export default FormSupplier;
