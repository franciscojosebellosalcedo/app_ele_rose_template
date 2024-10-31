import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CImage, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setSet } from '../../../../features/set/setSlice'
import { IResponseHttp, ISetModel, IUserModel } from '../../../../models/models'
import { SetService } from '../set.service'

type Props ={
  set: ISetModel
  index: number
  setSetSelected: Function
  setIsOpenModalSet: Function
}

const setService : SetService = SetService.getInstance();

const SetItem : FC<Props> = ({
  set,
  index,
  setSetSelected,
  setIsOpenModalSet
}) => {

  const [openConfirm , setOpenConfirm] = useState<boolean>(false);

  const user : IUserModel = useSelector((state: any) => state.user.data);

  const dispatch = useDispatch();

  const changeStatus = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (!openConfirm) {
        toast(`¿ Quieres ${ set.status ? "deshabilitar": "habilitar"} la colección ${set.name} ?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              if (user?.accessToken) {

                const responseRequest: IResponseHttp = await setService.changeStatusSet(
                  set,
                  user.accessToken
                );

                if (responseRequest.status === 200 && responseRequest.response) {

                  const setResponseRequest: ISetModel = responseRequest.data;

                  dispatch(setSet(setResponseRequest));

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
    <tr key={set._id}>
     <td>
      <div className='d-flex align-items-center w-300px'>
        <div className=' me-3'>
            <CImage
            rounded
            width={50}
            height={50}
              src={set.imagen}
            />
        </div>
        <div className='d-flex align-items-center'>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              set.name
            }
            </div>
          </div>
        </div>
      </div>
    </td>

    <td>
      <span className={`text-${set.status ? "primary": "danger"}`}>{set.status ? "Activo": "Inactivo"}</span>
    </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <CButton size='sm' onClick={(e)=>changeStatus(e)} style={{ border: '.3px solid #007bff' }}>
            <CIcon
              size="sm"
              icon={cilSwapHorizontal}
              style={{ cursor: 'pointer' }}
              title="Habilitar y deshabilitar"
            />
          </CButton>

          <CButton size='sm' onClick={()=>{
            setSetSelected(set);
            setIsOpenModalSet(true);
          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </td>
    </tr>
  )
}

export default SetItem
