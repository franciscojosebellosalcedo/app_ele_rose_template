import { cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { FC, useEffect, useState } from "react";
import { IDataGrouperClientModel, IGrouperClientModel } from "../../../../../models/models";
import FormGrouperClient from "./FormGrouperClient";
import GrouperClientItem from "./GrouperClientItem";

type Props = {
  groupers : IDataGrouperClientModel[],
  setGroupers: Function
}

const TableGrouperClient : FC<Props> = ({
  groupers,
  setGroupers
}) => {

  const [isOpenModal , setIsOpenModal] = useState(false);

  const [grouperSelected , setGrouperSelected] = useState<IDataGrouperClientModel | null>(null);

  const [indexSelected , setIndexSelected] = useState(null);

  return (
    <div className="table-responsive" style={{ position: 'relative' }}>

      <FormGrouperClient
        groupers={ groupers }
        setGroupers={ setGroupers }
        isOpenModal = { isOpenModal }
        grouperSelected={ grouperSelected }
        indexSelected =  { indexSelected }
        setIsOpenModal={setIsOpenModal}
        setGrouperSelected = { setGrouperSelected }
      />

      <div className="mb-2">
        <CCol className="text-right">
          <CButton  color="primary" onClick={(e) => {

            e.preventDefault();
            setIsOpenModal(true);

          }}>
            <CIcon icon={cilPlus} className="mr-2" />
              Nuevo agrupador (Opcional)
          </CButton>
        </CCol>
      </div>

      <table className="table align-middle gs-0 gy-4">
        <CTableHead color="primary">
          <CTableRow>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Télefono</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell></CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        {
          groupers && groupers.length > 0 ?
          <tbody>
            {
              groupers.map((dataGrouper: IDataGrouperClientModel , index: number) =>{
                return <GrouperClientItem
                index={ index }
                groupers={ groupers }
                setIsOpenModal={ setIsOpenModal }
                setGrouperSelected={ setGrouperSelected }
                setGroupers={ setGroupers }
                setIndexSelected = {setIndexSelected}
                key={dataGrouper.grouperClient._id ? dataGrouper.grouperClient._id : index }
                dataGrouper={dataGrouper}
                />
              } )
            }
          </tbody> : <></>
        }

      </table>
    </div>
  )
}

export default TableGrouperClient;
