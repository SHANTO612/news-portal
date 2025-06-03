import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundImage from '../../assets/page_not_found.jpg'; 
const Unable = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/dashboard'); // Or '/login' if unauthenticated
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <img
          src={NotFoundImage}
          alt="404 illustration"
          className="w-48 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          Oops! The page you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
  onClick={goHome}
  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-md transition"
>
  Go Back to Dashboard
</button>

      </div>
    </div>
  );
};

export default Unable;
