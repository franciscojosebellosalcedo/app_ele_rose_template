import React, { FC } from 'react'
import { IClientModel } from '../../../../models/models'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

type Props ={
  client: IClientModel
}

const ClientItem : FC<Props>= ({
  client
}) => {
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
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              client.email
            }
            </div>
          </div>
      </td>

      <td>
        <span className={`text-${client.status ? "primary": "danger"}`}>{client.status ? "Activo": "Inactivo"}</span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>

          <CButton onClick={()=>{

          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="lg" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </td>
    </tr>
  )
}

export default ClientItem;
