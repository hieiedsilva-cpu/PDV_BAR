import React, { useState, useRef, useEffect } from 'react';
import type { PaymentMethod } from '../types';
import Button from './ui/Button';
import { CreditCard, Banknote, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface PaymentModalProps {
  total: number;
  paymentMethod: PaymentMethod;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, paymentMethod, onClose, onConfirm }) => {
    const [amountReceived, setAmountReceived] = useState('');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (paymentMethod === 'PIX' && canvasRef.current) {
            const pixPayload = `CHAVE_PIX_AQUI_VALOR_${total.toFixed(2)}`;
            QRCode.toCanvas(canvasRef.current, pixPayload, { width: 220, margin: 1 }, (error) => {
                if (error) console.error("Falha ao gerar QR Code:", error);
            });
        }
    }, [paymentMethod, total]);
    
    const amountNum = parseFloat(amountReceived) || 0;
    const change = amountNum - total;
    const isConfirmDisabled = paymentMethod === 'Dinheiro' && amountNum < total;

    const renderContent = () => {
        switch (paymentMethod) {
            case 'Dinheiro':
                return (
                    <>
                        <label htmlFor="amountReceived" className="block mb-2 text-sm font-medium text-gray-400">Valor Recebido</label>
                        <input
                            id="amountReceived"
                            type="number"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            placeholder="R$ 0,00"
                            className="w-full p-3 text-2xl text-center bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                        {amountReceived && change >= 0 && (
                            <div className="mt-4 p-4 bg-dark-900 rounded-lg text-center">
                                <p className="text-gray-400">Troco</p>
                                <p className="text-3xl font-bold text-secondary">R$ {change.toFixed(2)}</p>
                            </div>
                        )}
                    </>
                );
            case 'PIX':
                return (
                    <div className="text-center py-2 flex flex-col items-center gap-4">
                        <p className="text-lg font-semibold">Aponte a câmera para pagar</p>
                        <div className="p-3 bg-white rounded-lg inline-block shadow-lg">
                            <canvas ref={canvasRef} />
                        </div>
                        <p className="text-sm text-gray-400">Aguardando confirmação do pagamento...</p>
                    </div>
                );
            case 'Cartão':
                 return (
                    <div className="text-center py-8">
                        <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4"/>
                        <p className="text-lg">Aproxime ou insira o cartão.</p>
                        <p className="mt-2 text-gray-400">Aguardando confirmação...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2 text-center">Pagamento com {paymentMethod}</h3>
                <p className="text-center text-gray-400 mb-4">Total a Pagar: <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span></p>
                
                <div className="my-6 min-h-[250px] flex items-center justify-center">
                    {renderContent()}
                </div>

                <div className="flex flex-col gap-2 mt-6">
                    <Button onClick={onConfirm} disabled={isConfirmDisabled} className="h-12 text-lg">Finalizar Venda</Button>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
