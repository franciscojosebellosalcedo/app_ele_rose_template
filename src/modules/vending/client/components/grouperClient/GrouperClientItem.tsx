import { FC } from "react";
import { IDataGrouperClientModel } from "../../../../../models/models";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilSwapHorizontal, cilTrash } from "@coreui/icons";

type Props = {
  dataGrouper : IDataGrouperClientModel
  index : number
  setGroupers : Function
  groupers : IDataGrouperClientModel[]
  setIsOpenModal: Function
  setGrouperSelected: Function
  setIndexSelected: Function
}

const GrouperClientItem : FC<Props> = ({
  dataGrouper,
  index,
  setGroupers,
  groupers,
  setIsOpenModal,
  setGrouperSelected,
  setIndexSelected
}) => {

  // remove grouper by index
  const removeGrouperByIndex = () =>{

    const listAux = groupers;

    listAux.splice( index , 1);

    setGroupers([...listAux]);

  }

  return (
    <tr key={dataGrouper.grouperClient._id ? dataGrouper.grouperClient._id : index}>
      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              dataGrouper.grouperClient.name
            }
            </div>
          </div>
      </td>

      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              dataGrouper.grouperClient.phone
            }
            </div>
          </div>
      </td>

      <td>
        <span className={`text-${dataGrouper.grouperClient.status ? "primary": "danger"}`}>{dataGrouper.grouperClient.status ? "Activo": "Inactivo"}</span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>

          <CButton size='sm' onClick={(e)=>{

            e.preventDefault();

            setIsOpenModal(true);

            setIndexSelected(index);

            setGrouperSelected(dataGrouper);

          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>

          {
            dataGrouper.grouperClient._id ?  "" :
              <CButton size='sm' onClick={(e)=>{

                e.preventDefault();
                removeGrouperByIndex();

              }} style={{ border: '.3px solid #007bff' }}>
                <CIcon size="sm" icon={cilTrash} style={{ cursor: 'pointer' }} title="Eliminar" />
              </CButton>
          }

        </div>
      </td>
    </tr>
  )
}

export default GrouperClientItem;
