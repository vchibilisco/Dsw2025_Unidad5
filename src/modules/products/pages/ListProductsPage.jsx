import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

function ListProductsPage() {
  return (
    <div>
      <Card>
        <div
          className='flex justify-between items-center mb-3'
        >
          <h1 className='text-3xl'>Productos</h1>
          <Button
            className='h-11 w-11 rounded-2xl sm:hidden'
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
          </Button>

          <Button className='hidden sm:block'>
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div
            className='flex items-center gap-3'
          >
            <input type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />
            <Button className='h-11 w-11'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </Button>
          </div>
          <select className='text-[1.3rem]'>
            <option value="all">Todos</option>
            <option value="enabled">Habilitados</option>
            <option value="disabled">Inhabilitados</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
        <Card>
          <h1>SKU - Nombre de producto</h1>
          <p className='text-base'>Stock - Estado - Precio</p>
        </Card>
      </div>
    </div>

  );
};

export default ListProductsPage;
