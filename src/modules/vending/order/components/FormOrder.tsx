import { CButton, CCol, CForm, CFormInput, CFormSelect, CRow, CSpinner } from "@coreui/react";
import { useState } from "react";
import ContainerContent from "../../../../helpers/ContainerContent";
import { useNavigate, useParams } from "react-router-dom";
import TableOrder from "./TableOrder";
import TablePartsOrder from "./TablePartsOrder";

const FormOrder = () => {

  const [isLoaderGet , setIsLoaderGet] = useState(false);

  const params = useParams();

  const [isLoader , setIsLoader] = useState(false);

  const navigate = useNavigate();

  return (
    isLoaderGet ?

      <CSpinner color="primary"/>

    :
    <ContainerContent title={params.id ? "Editar pedido": "Nuevo pedido"}>
      <CForm>

        <CRow className="mb-3">

          <CCol className="mb-4" md="6" xs="12">

            <CFormSelect
                label="Cliente"
                className="form-control"
                defaultValue={'1'}
                options={[
                  { label: 'Seleccionar', value: '0' },
                ]}
              />

          </CCol>

          <CCol className="mb-4" md="6" xs="12">

            <CFormSelect
                label="Agrupador (Opcional)"
                className="form-control"
                defaultValue={'1'}
                options={[
                  { label: 'Seleccionar', value: '0' },
                ]}
              />

          </CCol>

          <CCol className="mb-4" md="6" xs="12">

            <CFormSelect
              label="Dirección"
              className="form-control"
              defaultValue={'1'}
              options={[
                { label: 'Seleccionar', value: '0' },
              ]}
            />

          </CCol>

          <CCol className="mb-4" md="6" xs="12">

            <CFormSelect
              label="Condiciones de pago"
              className="form-control"
              defaultValue={'1'}
              options={[
                { label: 'Seleccionar', value: '0' },
              ]}
            />

          </CCol>

          <CCol className="mb-4" md="6" xs="12">

            <CFormSelect
              label="Forma de pago"
              className="form-control"
              defaultValue={'1'}
              options={[
                { label: 'Seleccionar', value: '0' },
              ]}
            />

          </CCol>

        </CRow>

        <TablePartsOrder/>

        <div className="d-flex justify-content-end mb-4 mt-2">
          <CButton
            className="me-4"
            onClick={() => navigate('/vending/order')}
            disabled={isLoader}
            color="secondary"
          >
            Cancelar
          </CButton>

          <CButton onClick={(e) => {

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

export default FormOrder;
