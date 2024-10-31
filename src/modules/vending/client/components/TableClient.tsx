import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CFormSelect, CRow, CSpinner, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../helpers/Pagination";
import Search from "../../../../helpers/Search";
import { IClientModel } from "../../../../models/models";
import { useSelector } from "react-redux";
import ClientItem from "./ClientItem";

const TableClient = () => {

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const clients : IClientModel[] = useSelector((state: any) => state.client.data.list);

  const clientsFound : IClientModel[] = useSelector((state: any) => state.client.data.found);

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
                <CButton color="primary" onClick={() => navigate('/vending/client/createClient')}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nuevo cliente
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
                  // paginateProducts(1, value);

                }}
                defaultValue={10}
                options={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '30', value: '30' },
                ]}
              />
            </div>

            <Search
              isLoaderGet ={false}
              handlerResetSearch={()=>{}}
              handlerSearch={()=>{}}
              placeholder='Buscar cliente'
            />
          </div>

          <h6 className="mt-4 mb-3">{`Sobre ${clients?.length === undefined ? 0 : clients.filter((client) => client.status === true).length} clientes activos`}</h6>

          <div className="table-responsive" style={{ position: 'relative' }}>
            <table className="table align-middle gs-0 gy-4">
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Télefono</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>

              <tbody>
                {
                  clientsFound && clientsFound.length > 0 ?
                    <tbody>
                      {
                        clientsFound.map((client: IClientModel, index: number) =>{
                          return <ClientItem
                          key={client._id}
                          client={client}
                          />
                        } )
                      }
                    </tbody>
                  :

                  clients && clients.length > 0 ?
                  <tbody>
                    {
                      clients.map((client: IClientModel, index: number) =>{
                        return <ClientItem
                        key={client._id}
                        client={client}
                        />
                      } )
                    }
                  </tbody> : <></>

                }
              </tbody>

            </table>
          </div>

          <Pagination currentPage={2} paginate={()=>{}} totalPages={5} />
        </div>
      )}
    </div>
  )
}

export default TableClient;
