import React, { useState, useMemo } from 'react';
import { CartItem } from '../../types';
import TrashIcon from '../icons/TrashIcon';
import QrCodeIcon from '../icons/QrCodeIcon';
import ClipboardIcon from '../icons/ClipboardIcon';
import { generateBRCode } from '../../utils/pix';
import SparklesIcon from '../icons/SparklesIcon';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const emptyShippingInfo = {
    name: '',
    address: '',
    phone: '',
    email: ''
};

const LoadingSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [shippingInfo, setShippingInfo] = useState(emptyShippingInfo);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const pixPayload = useMemo(() => {
    if (totalPrice <= 0) return { brCode: '', qrCodeUrl: '' };

    const brCode = generateBRCode({
      pixKey: 'pix.loja@massoterapia.com', // Using a generic store PIX key
      amount: totalPrice.toFixed(2),
      merchantName: 'Masso Store',
      merchantCity: 'SAO PAULO',
      txid: `MASSOSTORE${Date.now()}`.slice(0, 25)
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(brCode)}`;
    return { brCode, qrCodeUrl };
  }, [totalPrice]);

  const handleClose = () => {
    onClose();
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setStep('cart');
        setShippingInfo(emptyShippingInfo);
        setIsLoading(false);
    }, 300);
  };
  
  const handleNewOrder = () => {
    onClearCart();
    handleClose();
  }
  
  const handleShippingSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('payment');
  };

  const handlePaymentConfirm = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setStep('confirmation');
      }, 1500);
  };
  
  const handleCopy = () => {
    if (pixPayload.brCode) {
        navigator.clipboard.writeText(pixPayload.brCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={handleClose}>
      <div
        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slide-in 0.3s ease-out' }}
      >
        <header className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'cart' && 'Seu Carrinho'}
            {step === 'shipping' && 'Informações de Entrega'}
            {step === 'payment' && 'Pagamento'}
            {step === 'confirmation' && 'Pedido Confirmado!'}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </header>
        
        <div className="flex-grow p-6 overflow-y-auto">
            {step === 'cart' && (
                <>
                    {cartItems.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <li key={item.id} className="py-4 flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded-l-md hover:bg-gray-100">-</button>
                                            <span className="px-4 border-t border-b">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded-r-md hover:bg-gray-100">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 ml-4 p-2 rounded-full hover:bg-red-50">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-10">Seu carrinho está vazio.</p>
                    )}
                </>
            )}
            
            {step === 'shipping' && (
                <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
                     <input type="text" placeholder="Nome Completo" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"/>
                     <input type="email" placeholder="Email" value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"/>
                     <input type="tel" placeholder="Telefone (WhatsApp)" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"/>
                     <input type="text" placeholder="Endereço Completo (Rua, Nº, Bairro, Cidade, CEP)" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"/>
                </form>
            )}

            {step === 'payment' && (
                 <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pague para confirmar seu pedido</h3>
                    <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code ou utilize o "Copia e Cola".</p>
                    <img src={pixPayload.qrCodeUrl} alt="PIX QR Code" className="mx-auto rounded-lg border-4 border-white shadow-md w-[200px] h-[200px]" />

                    <div className="mt-6">
                        <label className="text-sm font-medium text-gray-600 block mb-1">PIX Copia e Cola</label>
                        <div className="flex items-center">
                            <input type="text" readOnly value={pixPayload.brCode} className="w-full bg-gray-100 border border-gray-300 rounded-l-md p-2 text-xs text-gray-700 focus:ring-0 focus:outline-none"/>
                            <button onClick={handleCopy} title="Copiar PIX" className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300">{copied ? 'Copiado!' : <ClipboardIcon className="w-5 h-5 text-gray-600"/>}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {step === 'confirmation' && (
                <div className="text-center flex flex-col items-center py-10">
                     <SparklesIcon className="w-16 h-16 text-violet-500 mb-4"/>
                     <h3 className="text-2xl font-bold text-gray-800">Obrigado pela sua compra!</h3>
                     <p className="text-gray-600 mt-2">Seu pedido foi recebido e será preparado para envio. Você receberá atualizações por email.</p>
                </div>
            )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-6 border-t bg-gray-50">
            {step === 'cart' && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-violet-700">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <button onClick={() => setStep('shipping')} className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">Finalizar Compra</button>
                </>
            )}
            {step === 'shipping' && (
                 <button type="submit" form="shipping-form" className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">Ir para Pagamento</button>
            )}
             {step === 'payment' && (
                 <button onClick={handlePaymentConfirm} disabled={isLoading} className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 flex justify-center items-center disabled:bg-violet-400 transition-colors">
                     {isLoading ? <LoadingSpinner /> : 'Já paguei, Confirmar Pedido'}
                 </button>
            )}
             {step === 'confirmation' && (
                 <button onClick={handleNewOrder} className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">Fazer Nova Compra</button>
            )}
          </footer>
        )}
      </div>
      <style>{`
          @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
      `}</style>
    </div>
  );
};

export default ShoppingCart;