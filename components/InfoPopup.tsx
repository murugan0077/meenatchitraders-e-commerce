import React from 'react';

interface InfoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop with blur and fade-in */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop"
                onClick={onClose}
            ></div>

            {/* Popup Content with zoom-in animation */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-popup border border-luxury-gold/20">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-luxury-gold transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-serif font-bold text-luxury-blue mb-6 border-b border-luxury-gold/30 pb-2">
                    {title}
                </h2>

                <div className="prose prose-sm text-gray-600 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {content}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="bg-luxury-blue text-white px-8 py-2 rounded-full hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoPopup;
