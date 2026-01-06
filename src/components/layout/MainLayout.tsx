import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />
      <Header />
      <main className="ml-16 pt-16">
        <div className="min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
