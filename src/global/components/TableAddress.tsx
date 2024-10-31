import { cilPencil, cilPlus, cilSwapHorizontal } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CForm, CFormSelect, CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { FC, useEffect, useState } from 'react'
import { ModalFooter } from 'react-bootstrap'
import { IAddresModel, IDataInputSelect, IDepartamentModel, IMunicipalityModel } from '../../models/models'
import Autocomplete from '../../components/AutoComplete'
import { useSelector } from 'react-redux'
import { colorRedInfoInput, getOptionsInputSelect } from '../../utils'
import { useFormik } from 'formik'
import * as Yup from "yup";
import clsx from 'clsx'

type Props ={
  listAddress: IAddresModel[]
  setListAddress: Function
}

const schemaValidation = Yup.object().shape({
  departament: Yup.string()
  .required("Se requiere departamento"),

  municipality: Yup.string()
  .required("Se requiere municipio"),

  description: Yup.string()
  .required("Se requiere la descripción")
  .min(5, "Mínimo 5 caracteres")
  .test(
    'no-espacios-solo',
    'Se requiere la descripción',
    (value) => value.trim().length > 0
  ),

  referencePoint: Yup.string()
  .optional()
  .min(5, "Mínimo 5 caracteres"),

  status: Yup.number()
    .required('Se require el status')
    .test('is-number', 'Valor no válido', (value) => {
      if (Number.isInteger(value)) return true
      if (!value) return false
      return isNaN(value)
    }),

})

const TableAddress : FC<Props> = ({
  listAddress,
  setListAddress
}) => {

  const [isOpenModal , setIsOpenModal] = useState<boolean>(false);

  const departaments : IDepartamentModel[] = useSelector((state: any) => state.departament.data.list);

  const municipalities : IMunicipalityModel[] = useSelector((state: any) => state.municipality.data.list);

  const [optionsDepartaments , setOptionsDepartaments] = useState<IDataInputSelect[]>([]);

  const [initialValues , setInitialValues] = useState<IAddresModel>({
    _id: "",
    client: "",
    departament: "",
    description: "",
    municipality: "",
    referencePoint: "",
    status: 1
  });

  const [optionsMunicipality , setOptionsMunicipality ] = useState<IDataInputSelect[]>([]);

  const [indexSelected , setIndexSelected ] = useState<number>(0);

  const [addresSelected , setAddresSelected] = useState<IAddresModel | null>(null);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schemaValidation,
    onSubmit: async (values : IAddresModel)=>{

      if(addresSelected){

        editAddress(values);

      }else{

        addNewAddress(values);

      }

      formik.resetForm();
      setIsOpenModal(false);
      setOptionsMunicipality([]);
      setAddresSelected(null);

    }
  });

  // edit address
  const editAddress = (values: IAddresModel)=>{

    const listAux = listAddress;
    listAux[indexSelected] = values;
    setListAddress([...listAux]);
  }

  // add new address
  const addNewAddress = (values: IAddresModel)=>{

    const listAux = listAddress;
    listAux.push(values);
    setListAddress([...listAux]);

  }

  const sendForm = (e: React.MouseEvent)=>{
    e.preventDefault();
    formik.submitForm();

  }

  // get departament by id
  const getDepartamentById = (idDepartament: string | undefined) : IDepartamentModel | undefined =>{
    return departaments.find((depa) => depa._id === idDepartament);
  }

  // get municipality by id
  const getMunicipalityById = (idMunicipality: string | undefined) : IMunicipalityModel | undefined =>{
    return municipalities.find((muni) => muni._id === idMunicipality);
  }

  useEffect(()=>{

    const optionDepartament = getOptionsInputSelect(departaments , "_id", ["name"]);

    setOptionsDepartaments(optionDepartament);

  },[departaments]);

  useEffect(()=>{

    if(formik.values.departament){

      const municipalitiesFound : IMunicipalityModel[] = municipalities.filter((muni) => muni.departament === formik.values.departament);
      const optionsMunicipality = getOptionsInputSelect(municipalitiesFound , "_id", ["name"]);

      setOptionsMunicipality(optionsMunicipality);

    }

  },[formik.values.departament, municipalities]);

  useEffect(()=>{

    if(addresSelected){

      const data: IAddresModel = {
        _id: addresSelected._id,
        client: addresSelected.client,
        departament: addresSelected.departament,
        description: addresSelected.description,
        municipality: addresSelected.municipality,
        referencePoint: addresSelected.referencePoint,
        status: addresSelected.status ? 1 : 0,
      }

      setInitialValues({...data});

      formik.setValues({...data});

    }

  },[addresSelected])

  return (
    <div className="table-responsive" style={{ position: 'relative' }}>
      <CModal
        visible={isOpenModal}
        onClose={()=>{

          setIsOpenModal(false);
          formik.resetForm();
          setOptionsMunicipality([]);
          setAddresSelected(null);

        }}
      >
        <CModalHeader>
          <CModalTitle>{addresSelected ? "Editar dirección": "Crear dirección"}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CForm>

          <div className="mb-3">
            <Autocomplete
              options={[
                {label: "Seleccionar", value: ""},
                ...optionsDepartaments
              ]}
              label='Departamento'
              isLabelTitle
              onSelect={(selected)=>{
                formik.setFieldValue("departament" , selected.value);
                formik.setFieldValue("municipality", "");
                setOptionsMunicipality([]);
              }}
              className=''
              defaultValue={formik.values.departament}
            />
            {formik.touched.departament && formik.errors.departament && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.departament}
                  </span>
                </div>
              </div>
            )}

          </div>

          <div className="mb-3">
            <Autocomplete
              options={[
                {label: "Seleccionar", value: ""},
                ...optionsMunicipality
              ]}
              label='Municipio'
              isLabelTitle
              onSelect={(selected)=>{

                formik.setFieldValue("municipality" , selected.value);

              }}
              className=''
              defaultValue={formik.values.municipality}
            />
            {formik.touched.municipality && formik.errors.municipality && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.municipality}
                  </span>
                </div>
              </div>
            )}

          </div>

          <div className="mb-3">
            <CFormTextarea
                label="Descripción "
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
              {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" style={{ color: colorRedInfoInput }}>
                    {formik.errors.description}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormTextarea
                label="Punto de referencia (Opcional) "
                rows={4}
                placeholder="Escribe el punto de referencia aquí..."
                {...formik.getFieldProps('referencePoint')}
                value={formik.values.referencePoint}
                className={clsx(
                  'form-control',
                  { 'is-invalid': formik.touched.referencePoint && formik.errors.referencePoint },
                  { 'is-valid': formik.touched.referencePoint && !formik.errors.referencePoint },
                )}
              />
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
              defaultValue={formik.values.status}
              options={[
                { label: 'Inactivo', value: "0" },
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
        <ModalFooter>
          <CButton
            onClick={() => {
              setIsOpenModal(false);
              formik.resetForm();

            }}
            color="secondary"
          >
            Cerrar
          </CButton>
          <CButton
            onClick={async (e) => {
              sendForm(e);
            }}
            color="primary"
          >
            Guardar
          </CButton>
        </ModalFooter>
      </CModal>
      <div className="mb-2">
        <CCol className="text-right">
          <CButton  color="primary" onClick={() => {
            setIsOpenModal(true);
          }}>
            <CIcon icon={cilPlus} className="mr-2" />
            Nueva dirección
          </CButton>
        </CCol>
      </div>
      <table className="table align-middle gs-0 gy-4">
        <CTableHead color="primary">
          <CTableRow>
            <CTableHeaderCell>Departamento</CTableHeaderCell>
            <CTableHeaderCell>Municipio</CTableHeaderCell>
            <CTableHeaderCell>Descripción</CTableHeaderCell>
            <CTableHeaderCell>Referencia</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell></CTableHeaderCell>
          </CTableRow>
        </CTableHead>

          {
            listAddress && listAddress.length > 0 ?
              <tbody>
                {
                  listAddress.map((address : IAddresModel , index: number) =>{
                    return <tr key={address._id}>
                        <td>
                            <div className='d-flex justify-content-start flex-column'>
                              <div  className=' text-hover-primary mb-1 fs-6'>
                              {
                                getDepartamentById(address.departament)?.name
                              }
                              </div>
                            </div>
                        </td>

                        <td>
                            <div className='d-flex justify-content-start flex-column'>
                              <div  className=' text-hover-primary mb-1 fs-6'>
                              {
                                getMunicipalityById(address.municipality)?.name
                              }
                              </div>
                            </div>
                        </td>

                        <td>
                            <div className='d-flex justify-content-start flex-column'>
                              <div  className=' text-hover-primary mb-1 fs-6'>
                              {
                                address.description
                              }
                              </div>
                            </div>
                        </td>

                        <td>
                            <div className='d-flex justify-content-start flex-column'>
                              <div  className=' text-hover-primary mb-1 fs-6'>
                              {
                                address.referencePoint ? address.referencePoint: "No"
                              }
                              </div>
                            </div>
                        </td>

                        <td>
                          <span className={`text-${address.status ? "primary": "danger"}`}>{address.status ? "Activo": "Inactivo"}</span>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
                            <CButton onClick={(e)=>{
                              // changeStatus(e)
                            }} style={{ border: '.3px solid #007bff' }}>
                              <CIcon
                                size="lg"
                                icon={cilSwapHorizontal}
                                style={{ cursor: 'pointer' }}
                                title="Habilitar y deshabilitar"
                              />
                            </CButton>

                            <CButton onClick={()=>{

                              setIndexSelected(index);
                              setAddresSelected(address);
                              setIsOpenModal(true);

                            }} style={{ border: '.3px solid #007bff' }}>
                              <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
                            </CButton>
                          </div>
                        </td>

                    </tr>
                  })
                }
              </tbody>
            : <tbody></tbody>
          }

      </table>
    </div>
  )
}

export default TableAddress
