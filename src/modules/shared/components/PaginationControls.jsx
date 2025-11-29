import Button from '../../shared/components/Button'; // Asegúrate de que la ruta sea correcta

function PaginationControls({
  pageNumber,
  totalPages,
  pageSize,
  setPageNumber,
  setPageSize,
  availableSizes = ['2', '10', '15', '20'],
}) {
  const handlePageSizeChange = (evt) => {
    // Cuando cambia el tamaño de página, siempre volvemos a la página 1.
    setPageNumber(1);
    setPageSize(Number(evt.target.value));
  };

  return (
    <div className='flex justify-center items-center mt-3'>
      {/* Botón ATRÁS */}
      <Button
        disabled={pageNumber === 1}
        onClick={() => setPageNumber(pageNumber - 1)}
        className='bg-gray-200 disabled:bg-gray-100 text-base px-3 py-1 rounded-l' // Se agregaron clases básicas para estilos consistentes
      >
        Atras
      </Button>

      {/* Indicador de página */}
      <span className='text-base px-3 py-1 '>{pageNumber} / {totalPages}</span>

      {/* Botón SIGUIENTE */}
      <Button
        disabled={pageNumber >= totalPages || totalPages === 0} // totalPages === 0 añadido como seguridad
        onClick={() => setPageNumber(pageNumber + 1)}
        className='bg-gray-200 disabled:bg-gray-100 text-base px-3 py-1 rounded-r'
      >
        Siguiente
      </Button>

      {/* Selector de tamaño de página (Page Size) */}
      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        className='ml-3 text-base border p-1 rounded' // Clases añadidas para un estilo base
      >
        {availableSizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
  );
}

export default PaginationControls;