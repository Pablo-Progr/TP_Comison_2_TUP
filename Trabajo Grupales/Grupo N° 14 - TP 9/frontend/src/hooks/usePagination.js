import { useState, useMemo } from 'react';

/**
 * Hook para manejar paginación de datos
 * @param {Array} data - Array de datos a paginar
 * @param {number} itemsPerPage - Cantidad de items por página (default: 10)
 */
const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Asegurar que data sea siempre un array
  const safeData = Array.isArray(data) ? data : [];

  // Calcular el total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(safeData.length / itemsPerPage);
  }, [safeData.length, itemsPerPage]);

  // Obtener los datos de la página actual
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return safeData.slice(startIndex, endIndex);
  }, [safeData, currentPage, itemsPerPage]);

  /**
   * Ir a una página específica
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Ir a la página siguiente
   */
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Ir a la página anterior
   */
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Ir a la primera página
   */
  const firstPage = () => {
    setCurrentPage(1);
  };

  /**
   * Ir a la última página
   */
  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  /**
   * Resetear a la primera página
   */
  const reset = () => {
    setCurrentPage(1);
  };

  // Calcular rango de items actuales
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, safeData.length);

  return {
    // Datos
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: safeData.length,
    startItem,
    endItem,
    
    // Estado
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    
    // Acciones
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    reset,
  };
};

export default usePagination;
