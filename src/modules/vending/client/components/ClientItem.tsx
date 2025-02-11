import React, { FC, useState } from 'react'
import { IClientModel, IResponseHttp, IUserModel } from '../../../../models/models'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSwapHorizontal } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { ClientService } from '../client.service'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setClient } from '../../../../features/client/clientSlice'

type Props ={
  client: IClientModel
}

const clientService : ClientService = ClientService.getInstance();

const ClientItem : FC<Props>= ({
  client
}) => {

  const user : IUserModel | undefined = useSelector( (state : any ) => state.user.data);

  const navigate = useNavigate();

  const [openConfirm , setOpenConfirm] = useState(false);

  const dispatch = useDispatch();

  // change status client
  const changeStatusClient = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (!openConfirm) {
        toast(`¿ Quieres ${ client.status ? "deshabilitar": "habilitar"} el cliente ${client.name} ?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              if (user?.accessToken) {

                const responseRequest: IResponseHttp = await clientService.changeStatusClient(
                  client,
                  user.accessToken
                );

                if (responseRequest.status === 200 && responseRequest.response) {

                  const dataResponse : IClientModel = responseRequest.data;

                  dispatch( setClient( dataResponse ) );

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
    <tr key={client._id}>
      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              client.name
            }
            </div>
          </div>
      </td>

      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              client.phone
            }
            </div>
          </div>
      </td>

      <td>
        <span className={`text-${client.status ? "primary": "danger"}`}>{client.status ? "Activo": "Inactivo"}</span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>


          <CButton size='sm' onClick={(e)=>{

            changeStatusClient(e);

          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilSwapHorizontal} style={{ cursor: 'pointer' }} title="Deshabilitar" />
          </CButton>

          <CButton size='sm' onClick={()=>{
            navigate(`/vending/client/editClient/${client._id}`);
          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </td>
    </tr>
  )
}

export default ClientItem;
