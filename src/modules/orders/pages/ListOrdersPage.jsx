import Card from '../../shared/components/Card';

/*
const orderStatus ={
  ALL: '',
  PENDING: '1', 
  PROCESSING: '2',
  SHIPPED: '3',
  DELIVERED: '4',
  CANCELED: '5',
};
*/

function ListOrdersPage() {


  return (
    <div>
      <Card>
        <div 
          className='flex justify-between items-center mb-3'
        >
          <h1 className='text-3x1'>Lista de Ordenes</h1>
        </div>
{/*
        <div className='flex flex-col sm:flex-row gap-4'>
          <div
            className='flex items-center gap-3'
          >
            <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />
            <Button className='h-11 w-11' onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </Button>
          </div>
          <select onChange={evt => setStatus(evt.target.value)} className='text-[1.3rem]'>
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>

        </div>*/}
      </Card>
    </div>

  );
};

export default ListOrdersPage;
