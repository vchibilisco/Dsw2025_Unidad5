function Input({ label, error = '', ...restProps }) {
  return (
    <div
      className='
        flex
        flex-col
        h-20
      '
    >
      <label>{label}:</label>
      <input className={ error && 'border-red-400' } { ...restProps }/>
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
};

export default Input;
