import { CCardHeader, CCol, CRow } from '@coreui/react'
import React, { FC } from 'react'

type Props = {
  children: React.ReactNode
  title: string
}

const ContainerContent : FC<Props> = ({
  title, children
}) => {
  return (
    <CRow>
      <CCol >

          <CCardHeader className='fs-4' style={{marginBottom: "40px"}}>
            <strong>{title}</strong>
          </CCardHeader>

          {children}

      </CCol>
    </CRow>
  )
}

export default ContainerContent;
