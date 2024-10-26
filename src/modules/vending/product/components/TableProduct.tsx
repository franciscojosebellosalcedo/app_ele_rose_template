import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow, CSpinner, CTable, CTableBody, CTableCaption, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../helpers/Pagination";
import { IProductModel } from "../../../../models/models";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";

const TableProduct = () => {

  const productList : IProductModel[] = useSelector((state: any) => state.product.data.list);

  const productFound : IProductModel[] = useSelector((state: any) => state.product.data.found);

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div>

     {
      isLoader ?
      <CSpinner color="primary" />
      :
        <div >

          <div className='d-flex flex-column gap-4 mt-2 flex-sm-row align-items-start'>
            <CRow className="mb-1">
              <CCol className="text-right">
                <CButton color="primary" onClick={() => navigate("/vending/product/createProduct")}>
                  <CIcon icon={cilPlus} className="mr-2" />
                  Nuevo producto
                </CButton>
              </CCol>
            </CRow>

            {/* <div className='d-flex align-items-center gap-2'>
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
            </div> */}

            {/* <Search
              isLoaderGet ={isLoaderGet}
              handlerResetSearch={resetSearch}
              handlerSearch={search}
              placeholder='Buscar categoría'
            /> */}

          </div>

          <CTable responsive={"xxl"} caption="top">
            <CTableCaption>{`Sobre ${productList?.length === undefined ? 0 : productList.filter((product) => product.status === true).length} productos activos`}</CTableCaption>
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Colección</CTableHeaderCell>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Precio</CTableHeaderCell>
                <CTableHeaderCell>Imagen</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>

              {
                productFound && productFound.length > 0 ?
                  <>
                    {
                      productFound.map((product: IProductModel, index: number) =>{
                        return <ProductItem
                          product={product}
                          index={index}
                        />
                      } )
                    }
                  </>
                :

                productList && productList.length > 0 ?
                  <>
                    {
                      productList.map((product: IProductModel, index: number) =>{
                        return <ProductItem
                        product={product}
                        index={index}
                      />
                      } )
                    }
                  </> : <></>

              }

            </CTableBody>
          </CTable>

          <Pagination
            currentPage={1}
            paginate={()=>{}}
            totalPages={3}
          />

        </div>
     }

    </div>
  )
}

export default TableProduct;
