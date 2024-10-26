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
    <CTableRow key={set._id}>
      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
      <CTableDataCell>{set.name}</CTableDataCell>
      <CTableDataCell>
        <span className={`text-${set.status ? "primary": "danger"}`}>{set.status ? "Activo": "Inactivo"}</span>
      </CTableDataCell>
      <CTableDataCell>
        <CImage rounded width={50} height={50} src={set.imagen} />
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
            setSetSelected(set);
            setIsOpenModalSet(true);
          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </CTableDataCell>
    </CTableRow>
  )
}

export default SetItem
