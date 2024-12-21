import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow, CSpinner } from "@coreui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import { ORDER_ADDRESS_ENTITY } from "../../../../config";
import { addClient, setClient } from "../../../../features/client/clientSlice";
import TableAddress from "../../../../global/components/TableAddress";
import { AddressService } from "../../../../global/services/address.service";
import ContainerContent from "../../../../helpers/ContainerContent";
import { IAddresModel, IClient, IClientModel, IDataGrouperClientModel, IResponseHttp, IUserModel } from "../../../../models/models";
import { colorRedInfoInput } from "../../../../utils";
import { ClientService } from "../client.service";
import { GrouperClientService } from "../grouperClient.service";
import TableGrouperClient from "./grouperClient/TableGrouperClient";

const schemaValidation = Yup.object().shape({
  name: Yup.string()
  .required("Se requiere nombre del cliente")
  .test(
    'no-espacios-solo',
    'Se requiere el nombre del cliente',
    (value) => value.trim().length > 0
  )
  .min(3, "Mínimo 3 caracteres"),

  phone: Yup.string()
  .required("Se requiere télefono del cliente")
  .min(10, "Mínimo 10 caracteres")
  .matches(/^\d+$/, "El teléfono solo debe contener números")
  .max(10, "Máximo 10 caracteres"),

  status: Yup.number()
  .required('Se require el status')
  .test('is-number', 'Valor no válido', (value) => {
    if (Number.isInteger(value)) return true
    if (!value) return false
    return isNaN(value)
  }),
})

type Props ={

}

const clientService : ClientService = ClientService.getInstance();

const addressService : AddressService = AddressService.getInstance();

const grouperClientService : GrouperClientService = GrouperClientService.getInstance();

const FormClient : FC<Props> = ({

}) => {

  const params = useParams();

  const [initialValues, setInitialValues] = useState<IClient>({
    name: "",
    phone: "",
    status: 1
  });

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const [isLoaderGet , setIsLoaderGet] = useState<boolean>(false);

  const navigate = useNavigate();

  const [listAddress, setListAddress] = useState<IAddresModel[]>([]);

  const user : IUserModel = useSelector((state : any) => state.user.data);

  const dispatch = useDispatch();

  const [clientFound , setClientFound] = useState<IClientModel | null>(null);

  const [groupers , setGroupers] = useState<IDataGrouperClientModel[]>([]);

  // get all address with id client
  const getAllAddressWithIdClient = (idClient: any)=>{

    const listAux = listAddress;

    for (let index = 0; index < listAux.length; index++) {

      const address = listAux[index];
      address.entityId = idClient;

    }

    return listAux;
  }

  // get all groupers with id client created
  const getAllGroupersWithIdClientCreated = ( idClientCreated : string ) =>{

    const listAux = groupers;

    for (let index = 0; index < listAux.length; index++) {

      const dataGrouper = listAux[index];

      dataGrouper.grouperClient.clientId = idClientCreated;

    }

    return listAux;

  }

  // save client
  const saveClient = async (values : IClient)=>{

    setIsLoader(true);

    try {

      if(user.accessToken){

        const responseHttp : IResponseHttp = await clientService.saveClient(values , user.accessToken);

        if(responseHttp.status === 201 && responseHttp.response){

          const dataResponse : IClientModel = responseHttp.data;

          //save all address
          const listAddressWithIdClient = getAllAddressWithIdClient(dataResponse._id);

          await addressService.saveListAddress(listAddressWithIdClient , user.accessToken);

          //save all groupers with id client created
          const listGrupersWithIdClient = getAllGroupersWithIdClientCreated(dataResponse._id);

          await grouperClientService.saveGrouperClient(listGrupersWithIdClient , user.accessToken);

          dispatch(addClient(dataResponse));

          toast.success(responseHttp.message);

          navigate("/vending/client");

        }
      }

    } catch (error: any) {

      toast.error(error.message);

    }

    setIsLoader(false);

  }

  // get all groupers client by id client
  const getGrouperClientByIdClient = async (idClient : string ) =>{
    try {

      if(user.accessToken){

        const responseHttp : IResponseHttp = await grouperClientService.getGrouperClientByIdClient(idClient, user.accessToken);

        if( responseHttp.status === 200 && responseHttp.response ){

          const dataResponse : IDataGrouperClientModel[] = responseHttp.data;

          for (let index = 0; index < dataResponse.length; index++) {

            const dataGrouper = dataResponse[index];
            dataGrouper.grouperClient.status = dataGrouper.grouperClient.status ? 1 : 0 ;

          }

          setGroupers([...dataResponse]);

        }

      }

    } catch (error : any) {

      toast.error( error.message );

      setGroupers([]);

    }
  }

  // update client by id
  const updateClientById = async (values: IClient)=>{
    try {

      const id = params.id;

      if(user.accessToken && id){

        const responseHttp : IResponseHttp = await clientService.updateClientById( id , values , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const dataResponse : IClientModel = responseHttp.data;

          //update all address
          const listAddressWithIdClient = getAllAddressWithIdClient(dataResponse._id);

          await addressService.saveListAddress(listAddressWithIdClient , user.accessToken);

          //save all groupers with id client created
          const listGrupersWithIdClient = getAllGroupersWithIdClientCreated(dataResponse._id);

          await grouperClientService.saveGrouperClient(listGrupersWithIdClient , user.accessToken);

          dispatch(setClient(dataResponse));

          toast.success(responseHttp.message);

          navigate("/vending/client");

        }
      }


    } catch (error : any) {

      toast.error(error.message);

    }
  }

  // get one client by id
  const getClientById = async ()=>{

    setIsLoaderGet(true);

    try {

      const idClient = params.id;

      if(idClient && user.accessToken){

        const responseHttp : IResponseHttp = await clientService.getClientById(idClient, user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const dataResponse : IClientModel = responseHttp.data;

          const {_id , updatedAt , createdAt, ...restData} = dataResponse;

          // get all groupers
          await getGrouperClientByIdClient(_id);

          // get all address
          const responseHttpGetAddress : IResponseHttp = await addressService.getAllAddressByEntityAndEntityId(ORDER_ADDRESS_ENTITY.client , _id , user.accessToken);
          if(responseHttpGetAddress.status === 200 && responseHttpGetAddress.response){

            const dataResponseGetAddress : IAddresModel[] = responseHttpGetAddress.data;

            setListAddress([...dataResponseGetAddress]);

          }

          const data : IClient = {
            name: restData.name,
            phone: restData.phone,
            status: restData.status ? 1 : 0
          }

          setInitialValues({...data});

          formik.setValues({...data});

          setClientFound(dataResponse);
        }

      }

    } catch (error: any) {

      toast.error(error.message);
      navigate("/vending/client");

    }

    setIsLoaderGet(false);
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values : IClient)=>{

      if(params.id){

        await updateClientById(values);

      }else{

        await saveClient(values);
      }

    }
  });

  // send form
  const sendForm = (e: React.MouseEvent)=>{
    e.preventDefault();
    formik.submitForm();
  }

  useEffect(()=>{

    getClientById();

  },[user]);

  return (
    isLoaderGet ?

      <CSpinner color="primary"/>

    :
    <ContainerContent title={params.id ? "Editar cliente": "Nuevo cliente"}>
      <CForm>

        <CRow className="mb-3">

          <CCol className="mb-4" md="6" xs="12">

            <CFormInput
              label="Nombre"
              placeholder="Nombre de cliente"
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
              placeholder="Télefono de cliente"
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

        <TableAddress
          isOptional = { true }
          entity={ORDER_ADDRESS_ENTITY.client}
          listAddress={listAddress}
          setListAddress={setListAddress}
        />

        <hr />
        <p>Un cliente puede tener uno o más agrupadores, un agrupador es una persona que se puede beneficiar de un pedido del cliente.</p>

        <TableGrouperClient
          groupers={ groupers }
          setGroupers={ setGroupers }
        />

        <div className="d-flex justify-content-end mb-4 mt-2">
          <CButton
            className="me-4"
            onClick={() => navigate('/vending/client')}
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

export default FormClient;
