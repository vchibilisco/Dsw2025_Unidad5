import Button from "./Button";

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="w-full flex items-center gap-2 p-3">

      {/* INPUT */}
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Buscar productos..."
        className="
          border rounded
          w-full
          p-1 text-sm              /* mobile */
          sm:p-2 sm:text-base      /* desktop */
        "
      />

      {/* BOTÓN */}
      <Button
        className="
          h-8 w-8 p-1                      /* mobile */
          sm:h-11 sm:w-11 sm:p-0            /* desktop */
          flex items-center justify-center
        "
        onClick={onSearch}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 
            10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 
            10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}
