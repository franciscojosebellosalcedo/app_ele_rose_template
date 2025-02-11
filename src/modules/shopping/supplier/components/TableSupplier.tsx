import { CButton, CCol, CFormSelect, CRow, CSpinner, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import Pagination from "../../../../helpers/Pagination";
import Search from "../../../../helpers/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useSelector } from "react-redux";
import { IClientModel, IDataResponsePagination, IResponseHttp, ISupplierModel, IUserModel } from "../../../../models/models";
import { SupplierService } from "../supplier.service";
import { useDispatch } from "react-redux";
import { setAllSupplierFound, setAllSuppliers } from "../../../../features/supplier/supplierSlice";
import { toast } from "sonner";
import SupplierItem from "./SupplierItem";

const supplierService : SupplierService = SupplierService.getInstance();

const TableSupplier = () => {

  const [isLoader , setIsLoader ] = useState(false);

  const navigate = useNavigate();

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const dispatch = useDispatch();

  const [isLoaderGet , setIsLoaderGet] = useState(false);

  const suppliers : ISupplierModel[] = useSelector( (state : any) => state.supplier.data.list);

  const suppliersFound : ISupplierModel[] = useSelector( (state : any) => state.supplier.data.found);

  //search supplier in the database
  const search = async (value: string)=>{

    setIsLoaderGet(true);

    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await supplierService.search(value , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IClientModel[] = responseHttp.data;

          dispatch(setAllSupplierFound(data));

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

      await paginateSupplier(1, itemsPerPage);

    } catch (error: any) {

      toast.error(error.message);

    }
  }

  //paginated suppliers
  const paginateSupplier = async (page: number, itemsPerPageOptional?: number)=>{
    setIsLoader(true);
    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await supplierService.paginateSupplier(page, itemsPerPageOptional ? itemsPerPageOptional : itemsPerPage , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IDataResponsePagination = responseHttp.data;

          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);

          dispatch(setAllSupplierFound(data.registers));

        }
      }

    } catch (error : any) {

      dispatch(setAllSupplierFound([]));

    }

    setIsLoader(false);
  }

  // get all supplier
  const getSupplier = async () => {

    if (user?.accessToken) {

      try {

        const responseHttp : IResponseHttp = await supplierService.getSuppliers(user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          dispatch(setAllSuppliers(responseHttp.data));

        }

      } catch (error) {

        dispatch(setAllSuppliers([]));

      }

    }

  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

    paginateSupplier(currentPage);

  },[currentPage]);

  useEffect(()=>{

    getSupplier();

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
                <CButton color="primary" onClick={() => navigate('/shopping/supplier/createSupplier')}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nuevo proveedor
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
                  paginateSupplier(1, value);

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
              placeholder='Buscar proveedor'
            />
          </div>

          <h6 className="mt-4 mb-3">{`Sobre ${suppliers?.length === undefined ? 0 : suppliers.filter((supplier) => supplier.status === true).length} proveedores activos`}</h6>

          <div className="table-responsive" style={{ position: 'relative' }}>
            <table className="table align-middle gs-0 gy-4">
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Télefono</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>

                {
                  suppliersFound && suppliersFound.length > 0 ?
                    <tbody>
                      {
                        suppliersFound.map((supplier: ISupplierModel, index: number) =>{
                          return <SupplierItem
                          key={supplier._id}
                          supplier={ supplier }
                          />
                        } )
                      }
                    </tbody>
                  :

                  suppliers && suppliers.length > 0 ?
                  <tbody>
                    {
                      suppliers.map((supplier: ISupplierModel, index: number) =>{
                        return <SupplierItem
                        key={supplier._id}
                        supplier={supplier}
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

export default TableSupplier;

