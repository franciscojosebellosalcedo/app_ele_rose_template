import { CButton, CForm, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { IResponseHttp, ITypeSupplierModel, IUserModel } from "../../models/models";
import * as Yup from "yup";
import { toast } from "sonner";
import { TypeSupplierService } from "../services/typeSupplier.service";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addTypeSupplier } from "../../features/typeSupplier/typeSupplierSlice";
import { colorRedInfoInput } from "../../utils";

type Props = {
  isOpenModal: boolean
  setIsOpenModalTypeSupplier: Function
};

const schemaValidation = Yup.object().shape({
  name: Yup.string().required('Se requiere el nombre del tipo de proveedor').min(5, 'Mínimo 5 caracteres')
  .test(
    'no-espacios-solo',
    'Se requiere el nombre del tipo de proveedor',
    (value) => value.trim().length > 0
  ),

  status: Yup.number()
    .required('Se require el status')
    .test('is-number', 'Valor no válido', (value) => {
      if (Number.isInteger(value)) return true
      if (!value) return false
      return isNaN(value)
    }),
});

const initialValues : ITypeSupplierModel = {
  name: '',
  status: 1,
}

const typeSupplierService : TypeSupplierService = TypeSupplierService.getInstance();

const FormTypeSupplier : FC<Props> = ({
  isOpenModal, setIsOpenModalTypeSupplier
}) => {

  const [isLoader , setIsLoader] = useState(false);

  const user : IUserModel = useSelector( (state : any) => state.user.data);

  const dispatch = useDispatch();

  // send form
  const sendForm = () =>{

    formik.submitForm();

  }

  // create type supplier
  const createTypeSupplier = async ( values : ITypeSupplierModel ) =>{

    setIsLoader(true);

    try {

      if(user.accessToken){

        const responseHttp : IResponseHttp = await typeSupplierService.createTypeSupplier(values , user.accessToken);

        if(responseHttp.status === 201 && responseHttp.response){

          const dataResponse : ITypeSupplierModel = responseHttp.data;

          dispatch(addTypeSupplier(dataResponse));

          toast.success( responseHttp.message );

          formik.resetForm();

          setIsOpenModalTypeSupplier(false);

        }
      }

    } catch (error : any ) {

      toast.error( error.message );
      formik.resetForm();

      setIsOpenModalTypeSupplier(false);

    }

    setIsLoader(false);

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values : ITypeSupplierModel) =>{

      await createTypeSupplier(values);

    }
  });

  const handleFormKeyPress = (e : KeyboardEvent) => {

    if (e.key === 'Enter' && isLoader === false && isOpenModal === true) {

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
        setIsOpenModalTypeSupplier(false);
        formik.resetForm()
      }}
    >
      <CModalHeader>
        <CModalTitle>Nuevo tipo de proveedor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={formik.handleSubmit} className="row">
          <div className="mb-3">
            <CFormInput
              type="text"
              label="Nombre"
              placeholder="Nombre del tipo de proveedor"
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

            setIsOpenModalTypeSupplier(false);

            formik.resetForm();

          }}
          color="secondary"
        >
          Cerrar
        </CButton>
        <CButton
          disabled={isLoader}
          onClick={async (e) => {

            sendForm();

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

export default FormTypeSupplier;
