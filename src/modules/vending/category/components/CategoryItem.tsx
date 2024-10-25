import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CImage, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import { FC, useState } from 'react'
import { ICategoryModel, IResponseHttp, IUserModel } from '../../../../models/models'
import { CategoryService } from '../category.service'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setCategory } from '../../../../features/category/categorySlice'

type Props ={
  category: ICategoryModel
  index: number
  setCategorySelected: Function
  setIsOpenModalCategory: Function
}

const categoryService : CategoryService = CategoryService.getInstance();

const CategoryItem : FC<Props> = ({
  category,
  index,
  setCategorySelected,
  setIsOpenModalCategory
}) => {

  const [openConfirm , setOpenConfirm] = useState<boolean>(false);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const dispatch = useDispatch();

  const changeStatus = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (!openConfirm) {
        toast(`¿ Quieres ${ category.status ? "deshabilitar": "habilitar"} la categoría ${category.name} ?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              if (user?.accessToken) {

                const responseRequest: IResponseHttp = await categoryService.changeStatusCategory(
                  category,
                  user.accessToken
                );

                if (responseRequest.status === 200 && responseRequest.response) {

                  const categoryResponseRequest: ICategoryModel = responseRequest.data;

                  dispatch(setCategory(categoryResponseRequest));

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
    <CTableRow key={category._id}>
      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
      <CTableDataCell>{category.name}</CTableDataCell>
      <CTableDataCell>
        <span className={`text-${category.status ? "primary": "danger"}`}>{category.status ? "Activo": "Inactivo"}</span>
      </CTableDataCell>
      <CTableDataCell>
        <CImage rounded width={50} height={50} src={category.imagen} />
      </CTableDataCell>
      <CTableDataCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <CButton onClick={(e)=>changeStatus(e)} style={{ border: '.3px solid #007bff' }}>
            <CIcon
              size="lg"
              icon={cilSwapHorizontal}
              style={{ cursor: 'pointer' }}
              title="Habilitar y deshabilitar"
            />
          </CButton>

          <CButton onClick={()=>{
            setCategorySelected(category);
            setIsOpenModalCategory(true);
          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </CTableDataCell>
    </CTableRow>
  )
}

export default CategoryItem
