import Card from '../../shared/components/Card';

function ProductPlaceholder({ product, onQuantityChange, onDelete }) {
  const unitPrice = Number(product?.currentUnitPrice) || 0;
  const subtotal = unitPrice * product.quantity;

  return (
    <Card className='w-full shadow-sm text-sm sm:text-base p-5 space-y-3'>
      <div className='font-semibold text-gray-800 truncate text-2xl'>
        {product?.name ?? 'Nombre de producto'}
      </div>

      <div className='space-y-1 text-gray-600'>
        <div>Cantidad de productos: {product.quantity}</div>
        <div>Sub Total: ${subtotal.toFixed(2)}</div>
      </div>

      <div className='flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end'>
        <button
          onClick={() => onQuantityChange(product.sku, -1)}
          className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
        >
          −
        </button>
        <span className='min-w-[24px] text-center'>{product.quantity}</span>
        <button
          onClick={() => onQuantityChange(product.sku, 1)}
          className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
        >
          +
        </button>
        <button
          onClick={() => onDelete(product.sku)}
          className='px-3 py-1 bg-purple-200 hover:bg-purple-300 transition rounded  text-sm'
        >
          Borrar
        </button>
      </div>
    </Card>
  );
}

export default ProductPlaceholder;