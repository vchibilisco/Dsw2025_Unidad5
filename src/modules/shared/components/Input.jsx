function Input({ label, error = '', ...restProps }) {
  return (
    <div
      className='
        flex
        flex-col
        h-20
      '
    >
      <label className='
        text-sm
        font-medium
        text-gray-700
        mb-1
        sm:text-base'
      >{label}:</label>
      <input className={`
          border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-purple-300 text-sm w-full
          ${error ? 'border-red-500' : 'border-gray-300'}
        `} { ...restProps }/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
