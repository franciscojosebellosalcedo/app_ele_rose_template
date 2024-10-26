import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormSelect,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableCaption,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../../../helpers/Pagination'
import { IDataResponsePagination, IProductModel, IResponseHttp, IUserModel } from '../../../../models/models'
import { useSelector } from 'react-redux'
import ProductItem from './ProductItem'
import Search from '../../../../helpers/Search'
import { ProductService } from '../product.service'
import { useDispatch } from 'react-redux'
import { setAllProductFound, setAllProducts } from '../../../../features/product/productSlice'
import { toast } from 'sonner'

const productService : ProductService = ProductService.getInstance();

const TableProduct = () => {
  const productList: IProductModel[] = useSelector((state: any) => state.product.data.list)

  const productFound: IProductModel[] = useSelector((state: any) => state.product.data.found)

  const [isLoader, setIsLoader] = useState<boolean>(false);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isLoaderGet , setIsLoaderGet] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // get all products
  const getProducts = async () => {

    if (user?.accessToken) {

      try {

        const responseHttp : IResponseHttp = await productService.getProducts(user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          dispatch(setAllProducts(responseHttp.data));

        }

      } catch (error) {

        dispatch(setAllProducts([]));

      }

    }

  }

   //search products in the database
   const search = async (value: string)=>{

    setIsLoaderGet(true);

    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await productService.search(value , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IProductModel[] = responseHttp.data;

          dispatch(setAllProductFound(data));

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

      await paginateProducts(1, itemsPerPage);

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  //paginated products
  const paginateProducts = async (page: number, itemsPerPageOptional?: number)=>{
    setIsLoader(true);
    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await productService.paginateProducts(page, itemsPerPageOptional ? itemsPerPageOptional : itemsPerPage , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IDataResponsePagination = responseHttp.data;

          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);

          dispatch(setAllProductFound(data.registers));

        }
      }

    } catch (error : any) {

      dispatch(setAllProductFound([]));

    }

    setIsLoader(false);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

    paginateProducts(currentPage);

  },[currentPage]);

  useEffect(()=>{

    getProducts();

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
                <CButton color="primary" onClick={() => navigate('/vending/product/createProduct')}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nuevo producto
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
                  paginateProducts(1, value);

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
              isLoaderGet ={isLoaderGet}
              handlerResetSearch={resetSearch}
              handlerSearch={search}
              placeholder='Buscar producto'
            />
          </div>

          <h6 className="mt-4 mb-3">{`Sobre ${productList?.length === undefined ? 0 : productList.filter((product) => product.status === true).length} productos activos`}</h6>

          <div className="table-responsive" style={{ position: 'relative' }}>
            <table className="table align-middle gs-0 gy-4">
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Colección</CTableHeaderCell>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Precio</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>

              {productFound && productFound.length > 0 ? (
                <tbody>
                  {productFound.map((product: IProductModel, index: number) => {
                    return <ProductItem product={product} index={index} />
                  })}
                </tbody>
              ) : productList && productList.length > 0 ? (
                <tbody>
                  {productList.map((product: IProductModel, index: number) => {
                    return <ProductItem product={product} index={index} />
                  })}
                </tbody>
              ) : (
                <></>
              )}
            </table>
          </div>

          <Pagination currentPage={currentPage} paginate={paginate} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

export default TableProduct
