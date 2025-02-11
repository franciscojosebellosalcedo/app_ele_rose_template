import { CButton, CCol, CFormSelect, CRow, CSpinner, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import Pagination from "../../../../helpers/Pagination";
import Search from "../../../../helpers/Search";
import CIcon from "@coreui/icons-react";
import { useState } from "react";
import { cilPlus } from "@coreui/icons";
import { useNavigate } from "react-router-dom";

const TableOrder = () => {

  const [isLoader , setIsLoader] = useState(false);

  const [isLoaderGet , setIsLoaderGet] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      {isLoader ? (
        <CSpinner color="primary" />
      ) : (
        <div>
          <div className="d-flex flex-column gap-4 mt-2 flex-sm-row align-items-start">
            <CRow className="mb-1">
              <CCol className="text-right">
                <CButton color="primary" onClick={() => navigate('/vending/order/createOrder')}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nuevo pedido
                </CButton>
              </CCol>
            </CRow>

            <div className='d-flex align-items-center gap-2'>
              <label htmlFor="limit">Límite</label>
              <CFormSelect
                style={{cursor: "pointer"}}
                id='limit'
                onChange={(e)=>{

                  const value =  parseInt(e.target.value);

                  // setItemsPerPage(value);
                  // paginateClients(1, value);

                }}
                defaultValue={1}
                options={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '30', value: '30' },
                ]}
              />
            </div>

            <Search
              isLoaderGet ={isLoaderGet}
              handlerResetSearch={()=>{}}
              handlerSearch={()=>{}}
              placeholder='Buscar pedido'
            />
          </div>

          <h6 className="mt-4 mb-3">{`Sobre 1 pedidos activos`}</h6>

          <div className="table-responsive" style={{ position: 'relative' }}>
            <table className="table align-middle gs-0 gy-4">
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Folio</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Creación</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>


            </table>
          </div>

          <Pagination currentPage={1} paginate={()=>{}} totalPages={5} />
        </div>
      )}
    </div>
  )
}

export default TableOrder;
