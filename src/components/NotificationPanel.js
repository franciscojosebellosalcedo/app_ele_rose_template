import React from 'react';
import { CButton, COffcanvas, COffcanvasBody, COffcanvasHeader } from '@coreui/react';

const NotificationPanel = ({ visible, onClose }) => {
  return (
    <COffcanvas visible={visible} onHide={onClose} placement="end">
      <COffcanvasHeader className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">Notificaciones</h5> {/* Establecer m-0 para quitar márgenes */}
        <CButton color="close" onClick={onClose} />
      </COffcanvasHeader>
      <COffcanvasBody>
        {/* Aquí puedes agregar el contenido de tus notificaciones */}
        <p>No tienes nuevas notificaciones.</p>
      </COffcanvasBody>
    </COffcanvas>

  );
};

export default NotificationPanel;
