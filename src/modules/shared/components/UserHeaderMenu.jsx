import Button from "./Button";
import SearchBar from "./SearchBar";

export default function UserHeaderMenu({
  title = "",
  search = null,
  totalItems = 0,
  onGoCart,
  onGoProducts,
  onOpenLogin,
  onOpenRegister,
  onOpenMobileMenu,
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center">

        {/* TÍTULO */}
        <h1 className="text-3xl">{title}</h1>

        {/* SEARCH DESKTOP */}
        <div className="hidden sm:flex flex-1 px-6">
          {search && (
            <SearchBar
              value={search.value}
              onChange={search.onChange}
              onSearch={search.onSearch}
            />
          )}
        </div>

        {/* SEARCH MOBILE */}
        <div className="sm:hidden w-full">
          {search && (
            <SearchBar
              value={search.value}
              onChange={search.onChange}
              onSearch={search.onSearch}
            />
          )}
        </div>

        {/* BOTONES DESKTOP */}
        <div className="hidden sm:flex items-center gap-3">

          {onGoProducts && (
            <Button onClick={onGoProducts}>Volver</Button>
          )}

          {onGoCart && (
            <Button onClick={onGoCart}>
              Carrito ({totalItems})
            </Button>
          )}

          <Button onClick={onOpenLogin}>Iniciar Sesión</Button>

          <Button onClick={onOpenRegister}>Registrarse</Button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <Button
          className="sm:hidden h-8 w-8 p-1 flex items-center justify-center"
          onClick={onOpenMobileMenu}
        >
          ≡
        </Button>
      </div>
    </div>
  );
}
