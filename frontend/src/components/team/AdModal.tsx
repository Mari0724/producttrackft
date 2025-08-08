import { useEffect, useState } from 'react';

interface AdModalProps {
    imageUrl: string;
    delayToClose: number;
    open: boolean;
    onClose: () => void;
}

export default function AdModal({ imageUrl, delayToClose, open, onClose }: AdModalProps) {
    const [canClose, setCanClose] = useState(false);
    const [remainingTime, setRemainingTime] = useState(delayToClose);

    useEffect(() => {
        if (open) {
            setCanClose(false);
            setRemainingTime(delayToClose);

            const countdown = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setCanClose(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [open, delayToClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-md w-full text-center shadow-lg relative">
                <img src={imageUrl} alt="Anuncio" className="rounded mb-4 max-h-96 mx-auto" />
                {!canClose ? (
                    <p className="text-gray-600">Puedes cerrar en {remainingTime} segundos...</p>
                ) : (
                    <button
                        onClick={onClose}
                        className="mt-4 bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                )}
            </div>
        </div>
    );
}