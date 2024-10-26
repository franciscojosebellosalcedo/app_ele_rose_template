import React, { FC } from 'react'
import { ICategoryModel, IProductModel, ISetModel } from '../../../../models/models'
import { CButton, CImage, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import { useSelector } from 'react-redux'

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
    <CTableRow key={product._id}>
    <CTableHeaderCell>{index + 1}</CTableHeaderCell>

    <CTableDataCell>{product.name}</CTableDataCell>

    <CTableDataCell>{product.set ? getSetById(product.set)?.name: "No aplica"}</CTableDataCell>

    <CTableDataCell>{getCategoryById(product.category)?.name}</CTableDataCell>

    <CTableDataCell>{product.amount}</CTableDataCell>

    <CTableDataCell>${product.realPrice}</CTableDataCell>

    <CTableDataCell>
      <CImage rounded width={50} height={50} src={product?.listImagen ? product.listImagen[0].imagen : ""} />
    </CTableDataCell>

    <CTableDataCell>
      <span className={`text-${product.status ? "primary": "danger"}`}>{product.status ? "Activo": "Inactivo"}</span>
    </CTableDataCell>

    <CTableDataCell>
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
    </CTableDataCell>
  </CTableRow>
  )
}

export default ProductItem;
