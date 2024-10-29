import React, { FC, useState } from 'react'
import { ICategoryModel, IProductModel, IResponseHttp, ISetModel, IUserModel } from '../../../../models/models'
import { CButton, CImage, CTableDataCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { formatPrice } from '../../../../utils'
import { toast } from 'sonner'
import { ProductService } from '../product.service'
import { setProduct } from '../../../../features/product/productSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type Props ={
  product: IProductModel
  index: number
}

const productService: ProductService = ProductService.getInstance();

const ProductItem : FC<Props> = ({
  product,
  index
}) => {

  const categories : ICategoryModel[] = useSelector((state: any) => state.category.data.list);

  const sets : ISetModel[] = useSelector((state: any) => state.set.data.list);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const [openConfirm , setOpenConfirm] = useState<boolean>(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // get category by id
  const getCategoryById = (idCategory: any) : ICategoryModel | undefined=>{
    return categories?.find((cate) => cate._id === idCategory);
  }

  // get set by id
  const getSetById = (idSet: any) : ISetModel | undefined=>{
    return sets?.find((set) => set._id === idSet);
  }

  // change status order
  const changeStatusProduct = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (!openConfirm) {
        toast(`¿ Quieres ${ product.status ? "deshabilitar": "habilitar"} el producto ${product.name} ?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              if (user?.accessToken) {

                const responseRequest: IResponseHttp = await productService.changeStatusProduct(
                  product,
                  user.accessToken
                );

                if (responseRequest.status === 200 && responseRequest.response) {

                  const productResponseRequest: IProductModel = responseRequest.data;

                  dispatch(setProduct(productResponseRequest));

                  toast.success(responseRequest.message);

                } else {

                  toast.error(responseRequest.message);

                }

                setOpenConfirm(false);

              }

            },
          },

          cancel: {
            label: 'No',
            onClick: () => {
              setOpenConfirm(false)
            },
          },

          onAutoClose: () => {
            setOpenConfirm(false)
          },

          onDismiss: () => {
            setOpenConfirm(false)
          },

        })

        setOpenConfirm(true);
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <tr key={product._id}>

    <td>
      <div className='d-flex align-items-center w-300px'>
        <div className=' me-3'>
            <CImage
            rounded
            width={50}
            height={50}
              src={product.listImagen && product.listImagen.length >0 ? product.listImagen[0].imagen : ""}
            />
        </div>
        <div className='d-flex align-items-center'>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              product.name
            }
            </div>
          </div>
        </div>
      </div>
    </td>

    <td>
        <div className=' text-hover-primary d-block mb-1 fs-6'>
        {product.set ? getSetById(product.set)?.name: "No"}
        </div>
    </td>


    <td>
        <div className=' text-hover-primary d-block mb-1 fs-6'>
          {getCategoryById(product.category)?.name}
        </div>
    </td>



    <td>{product.amount}</td>

    <td>${formatPrice(product.realPrice)}</td>

    <td>
      <span className={`text-${product.status ? "primary": "danger"}`}>{product.status ? "Activo": "Inactivo"}</span>
    </td>

    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        <CButton onClick={(e)=>changeStatusProduct(e)} style={{ border: '.3px solid #007bff' }}>
          <CIcon
            size="lg"
            icon={cilSwapHorizontal}
            style={{ cursor: 'pointer' }}
            title="Habilitar y deshabilitar"
          />
        </CButton>

        <CButton onClick={()=>{
          navigate(`/vending/product/editProduct/${product._id}`);
        }} style={{ border: '.3px solid #007bff' }}>
          <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
        </CButton>
      </div>
    </td>
  </tr>
  )
}

export default ProductItem;
