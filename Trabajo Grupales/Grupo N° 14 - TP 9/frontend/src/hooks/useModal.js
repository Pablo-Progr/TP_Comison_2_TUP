import { useState } from 'react';

/**
 * Hook para manejar el estado de un modal
 * @param {boolean} initialState - Estado inicial del modal (abierto/cerrado)
 */
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  /**
   * Abrir el modal
   * @param {*} data - Datos opcionales para pasar al modal
   */
  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  /**
   * Cerrar el modal
   */
  const closeModal = () => {
    setIsOpen(false);
    // Limpiar los datos después de un pequeño delay para la animación de cierre
    setTimeout(() => {
      setModalData(null);
    }, 200);
  };

  /**
   * Alternar el estado del modal
   */
  const toggleModal = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
