import { FC, useState } from "react";
import { IResponseHttp, ISupplierModel, ITypeSupplierModel, IUserModel } from "../../../../models/models";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import { cilPencil, cilSwapHorizontal } from "@coreui/icons";
import { useSelector } from "react-redux";
import { getRegisterById } from "../../../../utils";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { SupplierService } from "../supplier.service";
import { setSupplier } from "../../../../features/supplier/supplierSlice";

type Props = {
  supplier : ISupplierModel
}

const supplierService : SupplierService = SupplierService.getInstance();

const SupplierItem : FC<Props> = ({
  supplier
}) => {

  const navigate = useNavigate();

  const user : IUserModel = useSelector( (state : any) => state.user.data);

  const typesSuppliers : ITypeSupplierModel[] = useSelector ( (state : any) => state.typeSupplier.data.list);

  const [openConfirm , setOpenConfirm] = useState(false);

  const dispatch = useDispatch();

  // change status supplier
  const changeStatusSupplier = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (!openConfirm) {
        toast(`¿ Quieres ${ supplier.status ? "deshabilitar": "habilitar"} el proveedor ${supplier.name} ?`, {
          action: {
            label: 'Si',
            onClick: async () => {

              if (user?.accessToken) {

                const responseRequest: IResponseHttp = await supplierService.changeStatusSupplier(
                  supplier,
                  user.accessToken
                );

                if (responseRequest.status === 200 && responseRequest.response) {

                  const dataResponse : ISupplierModel = responseRequest.data;

                  dispatch( setSupplier( dataResponse ) );

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
    <tr key={supplier._id}>
      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              supplier.name
            }
            </div>
          </div>
      </td>

      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              supplier.phone
            }
            </div>
          </div>
      </td>

      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              supplier.email
            }
            </div>
          </div>
      </td>

      <td>
          <div className='d-flex justify-content-start flex-column'>
            <div  className=' text-hover-primary mb-1 fs-6'>
            {
              getRegisterById(typesSuppliers , "_id", supplier.typeId)?.name
            }
            </div>
          </div>
      </td>

      <td>
        <span className={`text-${supplier.status ? "primary": "danger"}`}>{supplier.status ? "Activo": "Inactivo"}</span>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>


          <CButton size='sm' onClick={(e)=>{

            changeStatusSupplier(e);

          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilSwapHorizontal} style={{ cursor: 'pointer' }} title="Deshabilitar" />
          </CButton>

          <CButton size='sm' onClick={()=>{

            navigate(`/shopping/supplier/editSupplier/${supplier._id}`);

          }} style={{ border: '.3px solid #007bff' }}>
            <CIcon size="sm" icon={cilPencil} style={{ cursor: 'pointer' }} title="Editar" />
          </CButton>
        </div>
      </td>
    </tr>
  )
}

export default SupplierItem;
