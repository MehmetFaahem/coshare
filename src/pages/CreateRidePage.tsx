import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CreateRideForm from '../components/rides/CreateRideForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateRidePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CreateRideForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateRidePage;