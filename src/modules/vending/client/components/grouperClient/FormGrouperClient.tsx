import { CButton, CForm, CFormInput, CFormSelect, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { ModalFooter } from "react-bootstrap";
import { ORDER_ADDRESS_ENTITY } from "../../../../../config";
import TableAddress from "../../../../../global/components/TableAddress";
import { IAddresModel, IDataGrouperClientModel, IGrouperClientModel } from "../../../../../models/models";
import { useFormik } from "formik";
import * as Yup from "yup";
import { colorRedInfoInput } from "../../../../../utils";
import { toast } from "sonner";

type Props = {
  isOpenModal: boolean
  setIsOpenModal: Function
  grouperSelected : IDataGrouperClientModel | null
  groupers : IDataGrouperClientModel[],
  setGroupers: Function
  indexSelected: number | null
  setGrouperSelected: Function
}

const schemaValidation = Yup.object().shape({
    name: Yup.string()
    .required("Se requiere nombre de agrupador")
    .test(
      'no-espacios-solo',
      'Se requiere el nombre de agrupador',
      (value) => value.trim().length > 0
    )
    .min(3, "Mínimo 3 caracteres"),

    phone: Yup.string()
    .required("Se requiere télefono de agrupador")
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

const FormGrouperClient : FC<Props> = ({
  isOpenModal,
  setIsOpenModal,
  grouperSelected,
  groupers,
  setGroupers,
  indexSelected,
  setGrouperSelected
}) => {

  const [initialValues , setInitialValues] = useState<IGrouperClientModel>({
    _id: "",
    clientId: "",
    name: "",
    phone: "",
    status: 1
  });

  const [address , setAddress] = useState<IAddresModel[]>([]);

  const [isOpenModalAddress , setIsOpenModalAddress] = useState(false);

  // validate if have grouper exist by phone
  const validateIfExistGrouperByPhone = (grouper : IGrouperClientModel) =>{

    return groupers.some( (dataGrouper : IDataGrouperClientModel) => dataGrouper.grouperClient.phone === grouper.phone );

  }

  // add new grouper client
  const addGrouperClient = ( values : IGrouperClientModel ) =>{

    values.status = parseInt(String(values.status));

    const data : IDataGrouperClientModel = {
      grouperClient: values,
      addressGrouper: address
    }

    if(validateIfExistGrouperByPhone(values)){

      toast.error("Ya existe un agrupador con ese teléfono");

    }else{

      const listAux = groupers;

      listAux.push({...data});

      setGroupers([...listAux]);

      setIsOpenModal(false);

      setAddress([]);

      formik.resetForm();

      toast.success("Agrupador agregado");

    }

  }

  // edit grouper client
  const editGrouperClient = ( values : IGrouperClientModel ) =>{

    values.status = parseInt(String(values.status));

    if(indexSelected !== null){

      const filterGroupers = groupers.filter( (_, index) => index !== indexSelected );
      if(filterGroupers.some( (dataGrouper) => dataGrouper.grouperClient.phone === values.phone) ){

        toast.info("Ya existe un agrupdor con ese teléfono");

      }else{

        const listAux = groupers;

        const data : IDataGrouperClientModel = {
          grouperClient : values ,
          addressGrouper : address
        }

        listAux[indexSelected] = data;

        setGroupers([...listAux]);

        setIsOpenModal(false);

        toast.success("Agrupador editado");

      }

    }

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit : (values : IGrouperClientModel)=>{

      if(address.length === 0){

        toast.info("Por lo menos agregue una dirección al agrupador");

      }else{

        if(grouperSelected){

          editGrouperClient(values);

        }else{

          addGrouperClient(values);

        }

      }

      setGrouperSelected(null);

    }

  });

  const sendForm = (e: any) =>{

    formik.submitForm();

  }

  useEffect(()=>{

    const group = grouperSelected?.grouperClient;

    const listAddress = grouperSelected?.addressGrouper;

    if(group && listAddress){

      setAddress([...listAddress]);

      const data : IGrouperClientModel = {
        _id: group._id,
        clientId: group.clientId,
        name: group.name,
        phone: group.phone,
        status: group.status
      }

      setInitialValues({
        ...data
      });

      formik.setValues({...data});

    }

  },[grouperSelected , indexSelected]);

  const handleFormKeyPress = (e : KeyboardEvent) => {

    if (e.key === 'Enter' && isOpenModal === true && isOpenModalAddress === false ) {

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

  }, [isOpenModal , isOpenModalAddress , formik]);

  return (
    <CModal
        visible={isOpenModal}
        onClose={()=>{

          setIsOpenModal(false);
          formik.resetForm();
          setAddress([]);
          setGrouperSelected(null);

        }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{grouperSelected ? "Editar agrupador": "Crear agrupador"}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CForm>

          <div className="mb-3">
            <CFormInput
              label="Nombre"
              placeholder="Nombre de agrupador"
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

          </div>

          <div className="mb-3">
            <CFormInput
              label="Télefono"
              placeholder="Télefono de agrupador"
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
                { label: 'Activo', value: '1' },
                { label: 'Inactivo', value: '0' },
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

          <TableAddress
            isOpenModal= { isOpenModalAddress}
            setIsOpenModal={ setIsOpenModalAddress}
            isOptional= { false }
            entity={ORDER_ADDRESS_ENTITY.groupClient}
            listAddress={ address }
            setListAddress={setAddress}
          />

        </CModalBody>

        <ModalFooter>
          <CButton
            onClick={(e) => {

              e.preventDefault();

              setIsOpenModal(false);

              formik.resetForm();

              setAddress([]);

              setGrouperSelected(null);

            }}
            color="secondary"
          >
            Cerrar
          </CButton>
          <CButton
            onClick={async (e) => {

              e.preventDefault();

              sendForm(e);

            }}
            color="primary"
          >
            Guardar
          </CButton>
        </ModalFooter>
      </CModal>
  )
}

export default FormGrouperClient;
