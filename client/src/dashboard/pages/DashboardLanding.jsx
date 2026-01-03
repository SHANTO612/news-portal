import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storeContext from '../../context/storeContext';

const DashboardLanding = () => {
  const { store } = useContext(storeContext);
  const navigate = useNavigate();

  // Optional: Auto-redirect after 2 seconds
  useEffect(() => {
    if (store.userInfo?.role) {
      const role = store.userInfo.role.trim().toLowerCase();
      const timer = setTimeout(() => {
        if (role === 'admin') navigate('/dashboard/admin');
        else if (role === 'writer') navigate('/dashboard/writer');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [store.userInfo, navigate]);

  if (!store.userInfo) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {store.userInfo.name}!</h1>
        <p className="mb-2">You are logged in as <span className="font-semibold">{store.userInfo.role}</span>.</p>
        <p className="mb-6">Redirecting you to your dashboard...</p>
        {store.userInfo.role.trim().toLowerCase() === 'admin' && (
          <button onClick={() => navigate('/dashboard/admin')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Admin Dashboard</button>
        )}
        {store.userInfo.role.trim().toLowerCase() === 'writer' && (
          <button onClick={() => navigate('/dashboard/writer')} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Go to Writer Dashboard</button>
        )}
      </div>
    </div>
  );
};

export default DashboardLanding; 