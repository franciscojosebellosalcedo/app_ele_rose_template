import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow } from "@coreui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import React, { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import TableAddress from "../../../../global/components/TableAddress";
import ContainerContent from "../../../../helpers/ContainerContent";
import { IAddresModel, IClient } from "../../../../models/models";
import { colorRedInfoInput } from "../../../../utils";
import { ClientService } from "../client.service";

const schemaValidation = Yup.object().shape({
  name: Yup.string()
  .required("Se requiere nombre del cliente")
  .test(
    'no-espacios-solo',
    'Se requiere el nombre del cliente',
    (value) => value.trim().length > 0
  )
  .min(3, "Mínimo 3 caracteres"),

  email: Yup.string()
  .email("Email no válido")
  .required("Se requiere el email del cliente")
  .test(
    'no-espacios-solo',
    'Se requiere el email del cliente',
    (value) => value.trim().length > 0
  )
  .min(5 , "Mínimo 5 caracteres"),

  phone: Yup.string()
  .required("Se requiere télefono del cliente")
  .min(10, "Mínimo 10 caracteres")
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

const FormClient : FC<Props> = ({

}) => {

  const params = useParams();

  const [initialValues, setInitialValues] = useState<IClient>({
    name: "",
    email: "",
    phone: "",
    status: 1
  });

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  const [listAddress, setListAddress] = useState<IAddresModel[]>([]);


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values : IClient)=>{

    }
  });

  // send form
  const sendForm = (e: React.MouseEvent)=>{

  }

  return (
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
              label="Email"
              placeholder="Email de cliente"
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

        </CRow>

        <CRow className="mb-3">

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

          <CCol className='mb-5'>
          <CFormSelect
            data-live-search="true"
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
          listAddress={listAddress}
          setListAddress={setListAddress}
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
