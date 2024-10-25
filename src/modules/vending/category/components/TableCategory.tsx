import { cilPlus } from '@coreui/icons'; // Icono de "+"
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormLabel,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableCaption,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { useEffect, useState } from 'react'
import FormCategory from './FormCategory'
import { ICategoryModel, IDataResponsePagination, IResponseHttp, IUserModel } from '../../../../models/models';
import { useSelector } from 'react-redux';
import CategoryItem from './CategoryItem';
import { CategoryService } from '../category.service';
import { useDispatch } from 'react-redux';
import { setAllCategories, setAllCategoriesFound } from '../../../../features/category/categorySlice';
import Pagination from '../../../../helpers/Pagination';
import { toast } from 'sonner';
import Search from '../../../../helpers/Search';

const categoryService : CategoryService = CategoryService.getInstance();

const TableCategory = () => {
  const [isOpenModalCategory, setIsOpenModalCategory] = useState<boolean>(false);

  const categoriesFound : ICategoryModel[] = useSelector((state: any) => state.category.data.found);

  const categoriesList : ICategoryModel[] = useSelector((state: any) => state.category.data.list);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const dispatch = useDispatch();

  const [categorySelected , setCategorySelected] = useState<ICategoryModel | null>(null);

  const [isLoaderGet , setIsLoaderGet] = useState<boolean>(false);

  // handler open modal category
  const handlerOpenModalCategory = () => {
    setIsOpenModalCategory(!isOpenModalCategory);
  }

  const getCategories = async () => {

    if (user?.accessToken) {

      try {

        const responseHttp : IResponseHttp = await categoryService.getCategories(user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          dispatch(setAllCategories(responseHttp.data));

        }

      } catch (error) {

        dispatch(setAllCategories([]));

      }

    }

  }

  //search categories in the database
  const search = async (value: string)=>{

    setIsLoaderGet(true);

    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await categoryService.search(value , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : ICategoryModel[] = responseHttp.data;

          dispatch(setAllCategoriesFound(data));

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

      await paginateCategories(1, itemsPerPage);

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  //paginated categories
  const paginateCategories = async (page: number, itemsPerPageOptional?: number)=>{
    setIsLoader(true);
    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await categoryService.paginateCategory(page, itemsPerPageOptional ? itemsPerPageOptional : itemsPerPage , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IDataResponsePagination = responseHttp.data;

          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);

          dispatch(setAllCategoriesFound(data.registers));

        }
      }

    } catch (error : any) {

      dispatch(setAllCategoriesFound([]));

    }

    setIsLoader(false);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

    paginateCategories(currentPage);

  },[currentPage]);

  useEffect(()=>{

    getCategories();

  },[user]);

  return (
    <>

     {
      isLoader ?
      <CSpinner color="primary" />
      :
        <div>

          <div className='d-flex flex-column gap-4 mt-2 flex-sm-row align-items-start'>
            <CRow className="mb-1">
              <CCol className="text-right">
                <CButton color="primary" onClick={() => handlerOpenModalCategory()}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nueva categoría
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
                  paginateCategories(1, value);

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
              placeholder='Buscar categoría'
            />

          </div>

          <FormCategory
            paginateCategories={paginateCategories}
            setCategorySelected={setCategorySelected}
            categorySelected={categorySelected}
            setIsOpenModalCategory={setIsOpenModalCategory}
            isOpenModal={isOpenModalCategory}
          />

          <CTable responsive="md" caption="top">
            <CTableCaption>{`Sobre ${categoriesList?.length === undefined ? 0 : categoriesList.filter((cate) => cate.status === true).length} categorías activas`}</CTableCaption>
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Imagen</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>

              {
                categoriesFound && categoriesFound.length > 0 ?
                  <>
                    {
                      categoriesFound.map((cate: ICategoryModel, index: number) =>{
                        return <CategoryItem
                        setCategorySelected={setCategorySelected}
                        setIsOpenModalCategory={setIsOpenModalCategory}
                        key={cate._id}
                        index={index}
                        category={cate}
                        />
                      } )
                    }
                  </>
                :

                categoriesList && categoriesList.length > 0 ?
                  <>
                    {
                      categoriesList.map((cate: ICategoryModel, index: number) =>{
                        return <CategoryItem
                        setCategorySelected={setCategorySelected}
                        setIsOpenModalCategory={setIsOpenModalCategory}
                        key={cate._id}
                        index={index}
                        category={cate}
                        />
                      } )
                    }
                  </> : <></>

              }

            </CTableBody>
          </CTable>

          <Pagination
            currentPage={currentPage}
            paginate={paginate}
            totalPages={totalPages}
          />

        </div>
     }

    </>
  )
}

export default TableCategory
