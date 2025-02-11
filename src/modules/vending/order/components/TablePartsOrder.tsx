import { cilPencil, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";

const TablePartsOrder = () => {
  return (
    <div className="table-responsive" style={{ position: 'relative' }}>

    <div className="mb-2">
      <CCol className="text-right">
        <CButton  color="primary" onClick={() => {

        }}>
          <CIcon icon={cilPlus} className="mr-2" />
          Nueva partida
        </CButton>
      </CCol>
    </div>

    <table className="table align-middle gs-0 gy-4">
      <CTableHead color="primary">
        <CTableRow>
          <CTableHeaderCell>Producto</CTableHeaderCell>
          <CTableHeaderCell>Precio</CTableHeaderCell>
          <CTableHeaderCell>Cantidad</CTableHeaderCell>
          <CTableHeaderCell>Total</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell></CTableHeaderCell>
        </CTableRow>
      </CTableHead>


    </table>
  </div>
  )
}

export default TablePartsOrder;
