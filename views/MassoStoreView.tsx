import React, { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import ShoppingCartIcon from '../components/icons/ShoppingCartIcon';
import ShoppingCart from '../components/store/ShoppingCart';

interface MassoStoreViewProps {
  products: Product[];
}

const ProductCard: React.FC<{ product: Product; onAddToCart: () => void }> = ({ product, onAddToCart }) => (
  <div className="border rounded-lg overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-xl">
    <div className="relative">
      <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
    </div>
    <div className="p-5 flex-grow flex flex-col">
      <h3 className="text-xl font-semibold text-violet-800">{product.name}</h3>
      <p className="text-gray-600 mt-2 text-sm flex-grow">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-violet-600">R$ {product.price.toFixed(2)}</span>
        <button
          onClick={onAddToCart}
          className="bg-violet-100 text-violet-700 font-semibold py-2 px-4 rounded-lg hover:bg-violet-600 hover:text-white transition-colors flex items-center gap-2"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Adicionar
        </button>
      </div>
    </div>
  </div>
);


const MassoStoreView: React.FC<MassoStoreViewProps> = ({ products }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const handleClearCart = () => {
    setCart([]);
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
        ))}
      </div>

      {cartItemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-transform hover:scale-110 flex items-center gap-3 z-40"
          aria-label={`Abrir carrinho com ${cartItemCount} itens`}
        >
          <ShoppingCartIcon className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        </button>
      )}
      
      <ShoppingCart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default MassoStoreView;
