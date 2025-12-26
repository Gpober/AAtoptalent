'use client';

import React, { useState } from 'react';
import AdminSidebar, { AdminMobileMenuButton } from '@/components/AdminSidebar';
import { Bell, Shield } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <AdminMobileMenuButton onClick={() => setSidebarOpen(true)} />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-400">Admin Control Panel</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin Avatar */}
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
