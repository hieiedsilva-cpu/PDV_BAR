
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from './ui/Button';
import Card from './ui/Card';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

interface NFCeModalProps {
    saleId: string;
    onClose: () => void;
}

const NFCeModal: React.FC<NFCeModalProps> = ({ saleId, onClose }) => {
    const { emitNFCe } = useData();
    const [cpf, setCpf] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleEmit = async () => {
        setStatus('loading');
        // Simulate API call to SEFAZ
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            emitNFCe(saleId, cpf);
            setStatus('success');
        } catch (e) {
            console.error("Failed to emit NFC-e:", e);
            setStatus('error');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-300">Emitindo NFC-e... Por favor, aguarde.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center py-8 text-green-400">
                        <CheckCircle size={48} className="mx-auto" />
                        <p className="mt-4 font-bold text-lg">NFC-e Emitida com Sucesso!</p>
                        <p className="text-sm text-gray-400">A venda foi concluída e a nota fiscal foi gerada.</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center py-8 text-red-400">
                        <XCircle size={48} className="mx-auto" />
                        <p className="mt-4 font-bold text-lg">Falha na Emissão</p>
                        <p className="text-sm text-gray-400">A venda foi salva, mas a nota não foi emitida. Verifique a conexão ou tente novamente mais tarde.</p>
                    </div>
                 );
            case 'idle':
            default:
                return (
                    <>
                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-1">CPF na Nota (Opcional)</label>
                            <input
                                id="cpf"
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="___.___.___-__"
                                className="w-full p-2 bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6">
                            <Button type="button" onClick={handleEmit} className="w-full sm:w-auto">
                                <FileText size={16} className="mr-2" />
                                Emitir NFC-e
                            </Button>
                            <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto">Não Emitir Nota</Button>
                        </div>
                    </>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6">Emissão de Nota Fiscal de Consumidor</h3>
                {renderContent()}
                 {(status === 'success' || status === 'error') && (
                    <div className="flex justify-end pt-6 mt-6 border-t border-dark-700">
                        <Button onClick={onClose}>Fechar</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NFCeModal;
