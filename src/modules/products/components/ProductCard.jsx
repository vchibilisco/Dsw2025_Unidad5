import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../../cart/useCart'; // importacion del hook

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    //se dispara al hacer clic en "Agregar"
    const handleAddToCart = () => {
        addToCart(product, 1);
        // usamos console.log en lugar de alert para evitar detener la app en el navegador
        console.log(`"${product.name}" added to cart! Current cart items: ${JSON.parse(localStorage.getItem('cart'))}`); 
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
            {/* Imagen simulada */}
            <div className="h-56 bg-gray-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Package size={64} className="text-gray-300" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {product.sku}
                    </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">${product.currentUnitPrice}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stockQuantity > 0 ? `${product.stockQuantity} disp.` : 'Agotado'}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.stockQuantity === 0}
                        className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                            product.stockQuantity > 0 
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <ShoppingCart size={18} />
                        {product.stockQuantity > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}