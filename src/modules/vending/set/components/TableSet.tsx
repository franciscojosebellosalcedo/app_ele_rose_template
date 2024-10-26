
import { cilPlus } from '@coreui/icons'; // Icono de "+"
import CIcon from '@coreui/icons-react';
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
  CTableRow
} from '@coreui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setAllSets, setAllSetsFound } from '../../../../features/set/setSlice';
import Pagination from '../../../../helpers/Pagination';
import Search from '../../../../helpers/Search';
import { IDataResponsePagination, IResponseHttp, ISetModel, IUserModel } from '../../../../models/models';
import { SetService } from '../set.service';
import FormSet from './FormSet';
import SetItem from './SetItem';

const setService : SetService = SetService.getInstance();

const TableSet = () => {
  const [isOpenModalSet, setIsOpenModalSet] = useState<boolean>(false);

  const setsFound : ISetModel[] = useSelector((state: any) => state.set.data.found);

  const setsList : ISetModel[] = useSelector((state: any) => state.set.data.list);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const dispatch = useDispatch();

  const [setSelected , setSetSelected] = useState<ISetModel | null>(null);

  const [isLoaderGet , setIsLoaderGet] = useState<boolean>(false);

  // handler open modal set
  const handlerOpenModalSet = () => {
    setIsOpenModalSet(!isOpenModalSet);
  }

  const getSets = async () => {

    if (user?.accessToken) {

      try {

        const responseHttp : IResponseHttp = await setService.getSets(user.accessToken);
        if(responseHttp.status === 200 && responseHttp.response){

          dispatch(setAllSets(responseHttp.data));

        }

      } catch (error) {

        dispatch(setAllSets([]));

      }

    }

  }

  //search sets in the database
  const search = async (value: string)=>{

    setIsLoaderGet(true);

    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await setService.search(value , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : ISetModel[] = responseHttp.data;

          dispatch(setAllSetsFound(data));

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

      await paginateSets(1, itemsPerPage);

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  //paginated sets
  const paginateSets = async (page: number, itemsPerPageOptional?: number)=>{
    setIsLoader(true);
    try {

      if(user?.accessToken){

        const responseHttp : IResponseHttp = await setService.paginateSet(page, itemsPerPageOptional ? itemsPerPageOptional : itemsPerPage , user.accessToken);

        if(responseHttp.status === 200 && responseHttp.response){

          const data : IDataResponsePagination = responseHttp.data;

          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);

          dispatch(setAllSetsFound(data.registers));

        }
      }

    } catch (error : any) {

      dispatch(setAllSetsFound([]));

    }

    setIsLoader(false);
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{

    paginateSets(currentPage);

  },[currentPage]);

  useEffect(()=>{

    getSets();

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
                <CButton color="primary" onClick={() => handlerOpenModalSet()}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nueva colección
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
                  paginateSets(1, value);

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
              placeholder='Buscar colección'
            />

          </div>

          <FormSet
            paginateSets={paginateSets}
            setSetSelected={setSetSelected}
            setSelected={setSelected}
            setIsOpenModalSet={setIsOpenModalSet}
            isOpenModal={isOpenModalSet}
          />

          <CTable responsive="md" caption="top">
            <CTableCaption>{`Sobre ${setsList?.length === undefined ? 0 : setsList.filter((cate) => cate.status === true).length} colecciones activas`}</CTableCaption>
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
                setsFound && setsFound.length > 0 ?
                  <>
                    {
                      setsFound.map((cate: ISetModel, index: number) =>{
                        return <SetItem
                        setSetSelected={setSetSelected}
                        setIsOpenModalSet={setIsOpenModalSet}
                        key={cate._id}
                        index={index}
                        set={cate}
                        />
                      } )
                    }
                  </>
                :

                setsList && setsList.length > 0 ?
                  <>
                    {
                      setsList.map((cate: ISetModel, index: number) =>{
                        return <SetItem
                        setSetSelected={setSetSelected}
                        setIsOpenModalSet={setIsOpenModalSet}
                        key={cate._id}
                        index={index}
                        set={cate}
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

export default TableSet;

