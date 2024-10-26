import React, { FC } from 'react'
import { ICategoryModel, IProductModel, ISetModel } from '../../../../models/models'
import { CButton, CImage, CTableDataCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { formatPrice } from '../../../../utils'

type Props ={
  product: IProductModel
  index: number
}
const ProductItem : FC<Props> = ({
  product,
  index
}) => {

  const categories : ICategoryModel[] = useSelector((state: any) => state.category.data.list);

  const sets : ISetModel[] = useSelector((state: any) => state.set.data.list);

  // get category by id
  const getCategoryById = (idCategory: any) : ICategoryModel | undefined=>{
    return categories.find((cate) => cate._id === idCategory);
  }

  // get set by id
  const getSetById = (idSet: any) : ISetModel | undefined=>{
    return sets.find((set) => set._id === idSet);
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
        <CButton  style={{ border: '.3px solid #007bff' }}>
          <CIcon
            size="lg"
            icon={cilSwapHorizontal}
            style={{ cursor: 'pointer' }}
            title="Habilitar y deshabilitar"
          />
        </CButton>

        <CButton onClick={()=>{
        }} style={{ border: '.3px solid #007bff' }}>
          <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
        </CButton>
      </div>
    </td>
  </tr>
  )
}

export default ProductItem;
