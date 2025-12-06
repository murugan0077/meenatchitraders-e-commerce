import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-center p-4 rounded-3xl my-8 mx-4">
            <div className="relative">
                <h1 className="text-[120px] md:text-[200px] font-bold text-white drop-shadow-md leading-none select-none font-sans">
                    404
                </h1>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    {/* Using a friendly monster emoji as a placeholder since image generation is currently limited. 
                In a real production environment, this would be a custom 3D asset. */}
                    <div className="text-[80px] md:text-[120px] animate-float">
                        👾
                    </div>
                </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-luxury-blue mt-8 mb-4 font-serif">
                Oops, I think we're lost...
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Let's get you back to somewhere familiar.
            </p>

            <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white text-luxury-blue font-medium rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 group border border-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back Home
            </button>
        </div>
    );
};

export default NotFoundPage;
