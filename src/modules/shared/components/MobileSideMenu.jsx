import Button from "./Button";

export default function MobileSideMenu({
  isOpen,
  title = "Menú",
  onClose,
  onGoCart,
  onGoProducts,
  onOpenLogin,
  onOpenRegister,
  totalItems = 0,
}) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6
        transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        sm:hidden
      `}
    >
      <h2 className="text-xl mb-4">{title}</h2>

      {onGoProducts && (
        <Button className="text-xl mt-4 w-full" onClick={onGoProducts}>
          Ver productos
        </Button>
      )}

      {onGoCart && (
        <Button className="text-xl mt-4 w-full" onClick={onGoCart}>
          Ver carrito ({totalItems})
        </Button>
      )}

      <Button className="text-xl mt-4 w-full" onClick={onOpenLogin}>
        Iniciar Sesión
      </Button>

      <Button className="text-xl mt-4 w-full" onClick={onOpenRegister}>
        Registrarse
      </Button>

      <Button className="text-xl mt-4 w-full" onClick={onClose}>
        Cerrar ✘
      </Button>
    </div>
  );
}
