import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CFormSelect, CRow, CSpinner, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../helpers/Pagination";
import Search from "../../../../helpers/Search";
import { IClientModel, IDataResponsePagination, IResponseHttp, IUserModel } from "../../../../models/models";
import { useSelector } from "react-redux";
import ClientItem from "./ClientItem";
import { ClientService } from "../client.service";
import { useDispatch } from "react-redux";
import { setAllClientFound, setAllClients } from "../../../../features/client/clientSlice";
import { toast } from "sonner";

const clientService : ClientService = ClientService.getInstance();

const TableClient = () => {

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const clients : IClientModel[] = useSelector((state: any) => state.client.data.list);

  const clientsFound : IClientModel[] = useSelector((state: any) => state.client.data.found);

  const [ isLoaderGet , setIsLoaderGet] = useState<boolean>(false);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // get all clients
  const getClients = async () => {

    if (user?.accessToken) {

      try {

        const responseHttp : IResponseHttp = await clientService.getClients(user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          dispatch(setAllClients(responseHttp.data));

        }

      } catch (error) {

        dispatch(setAllClients([]));

      }

    }

  }

  //search sets in the database
  const search = async (value: string)=>{

    setIsLoaderGet(true);

    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await clientService.search(value , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IClientModel[] = responseHttp.data;

          dispatch(setAllClientFound(data));

        }else{

          toast.info(responseHttp.message);

        }

      }

    } catch (error: any) {
      toast.error(error.message);
    }

    setIsLoaderGet(false);

  }

  //reset search
  const resetSearch = async ()=>{
    try {

      await paginateClients(1, itemsPerPage);

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  //paginated sets
  const paginateClients = async (page: number, itemsPerPageOptional?: number)=>{
    setIsLoader(true);
    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await clientService.paginateClients(page, itemsPerPageOptional ? itemsPerPageOptional : itemsPerPage , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IDataResponsePagination = responseHttp.data;

          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);

          dispatch(setAllClientFound(data.registers));

        }
      }

    } catch (error : any) {

      dispatch(setAllClientFound([]));

    }

    setIsLoader(false);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

    paginateClients(currentPage);

  },[currentPage]);

  useEffect(()=>{

    getClients();

  },[user]);

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

                  setItemsPerPage(value);
                  paginateClients(1, value);

                }}
                defaultValue={itemsPerPage}
                options={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '30', value: '30' },
                ]}
              />
            </div>

            <Search
              isLoaderGet ={isLoaderGet}
              handlerResetSearch={resetSearch}
              handlerSearch={search}
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

            </table>
          </div>

          <Pagination currentPage={currentPage} paginate={paginate} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

export default TableClient;
