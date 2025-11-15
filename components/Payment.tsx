

import React, { useState, useMemo } from 'react';
import { Booking } from '../types';
import { generateBRCode } from '../utils/pix';
import QrCodeIcon from './icons/QrCodeIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface PaymentProps {
  booking: Booking;
  onConfirm: () => void;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const Payment: React.FC<PaymentProps> = ({ booking, onConfirm, isLoading }) => {
  const { service } = booking;
  const [showPix, setShowPix] = useState(false);
  const [copied, setCopied] = useState(false);

  const pixPayload = useMemo(() => {
    if (!service || !service.pixKey) {
      return { brCode: 'ERRO: Chave PIX não configurada', qrCodeUrl: '' };
    }
    const depositAmount = (service.price * 0.5).toFixed(2);
    const brCode = generateBRCode({
      pixKey: service.pixKey,
      amount: depositAmount,
      merchantName: 'Massoterapia Concept', // Max 25 chars
      merchantCity: 'SAO PAULO', // Max 15 chars
      txid: `MASSOTERAPIA${Date.now()}`.slice(0, 25) // Max 25 chars
    });

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(brCode)}`;

    return { brCode, qrCodeUrl };
  }, [service]);


  if (!service) {
    return <div className="text-center text-red-500">Erro: Serviço não selecionado.</div>;
  }

  const depositAmount = service.price * 0.5;

  const handleCopy = () => {
    if (pixPayload.brCode) {
        navigator.clipboard.writeText(pixPayload.brCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };


  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmação e Pagamento</h2>
      <div className="bg-violet-50 p-6 rounded-lg max-w-md mx-auto">
        <p className="text-gray-700">Você está a um passo de confirmar sua reserva.</p>
        <p className="text-gray-600 mt-2">Para garantir seu horário, solicitamos um pagamento via PIX de 50% do valor do procedimento.</p>
        
        <div className="my-6 text-left">
            <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Serviço:</span>
                <span className="font-semibold">{service.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Valor Total:</span>
                <span className="font-semibold">R$ {service.price.toFixed(2)}</span>
            </div>
             <div className="flex justify-between py-2 text-violet-700">
                <span className="text-lg">Sinal via PIX (50%):</span>
                <span className="text-xl font-bold">R$ {depositAmount.toFixed(2)}</span>
            </div>
        </div>

        {!showPix ? (
            <button
              onClick={() => setShowPix(true)}
              disabled={!service.pixKey}
              className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center disabled:bg-violet-300 disabled:cursor-not-allowed"
            >
              <QrCodeIcon className="w-5 h-5 mr-2" />
              Pagar R$ {depositAmount.toFixed(2)} com PIX
            </button>
        ) : (
            <div className="mt-8 pt-6 border-t border-violet-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Pague para confirmar</h3>
                <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code abaixo ou utilize o "Copia e Cola" no app do seu banco.</p>
                <img src={pixPayload.qrCodeUrl} alt="PIX QR Code" className="mx-auto rounded-lg border-4 border-white shadow-md w-[200px] h-[200px] object-cover" />

                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-600 block mb-1">PIX Copia e Cola</label>
                    <div className="flex items-center">
                        <input 
                            type="text" 
                            readOnly 
                            value={pixPayload.brCode}
                            className="w-full bg-white border border-gray-300 rounded-l-md p-2 text-xs text-gray-700 focus:ring-0 focus:outline-none"
                        />
                        <button onClick={handleCopy} title="Copiar chave PIX" className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={!pixPayload.brCode}>
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <ClipboardIcon className="w-5 h-5 text-gray-600"/>
                            )}
                        </button>
                    </div>
                </div>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="w-full mt-8 bg-violet-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center disabled:bg-violet-400"
                >
                  {isLoading ? <LoadingSpinner /> : `Já paguei, Confirmar Agendamento`}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
