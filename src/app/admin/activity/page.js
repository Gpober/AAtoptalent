'use client';

import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Settings,
  Database
} from 'lucide-react';

const activityTypes = {
  login: { icon: LogIn, color: 'text-blue-500', bg: 'bg-blue-600/20' },
  logout: { icon: LogOut, color: 'text-gray-500', bg: 'bg-gray-600/20' },
  create: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-600/20' },
  update: { icon: Edit, color: 'text-yellow-500', bg: 'bg-yellow-600/20' },
  delete: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-600/20' },
  settings: { icon: Settings, color: 'text-purple-500', bg: 'bg-purple-600/20' },
};

// Demo activity data
const activityLog = [
  { id: 1, type: 'login', action: 'User logged in', user: 'admin@aatoptalent.com', ip: '192.168.1.1', time: '2025-12-26 18:30:00' },
  { id: 2, type: 'create', action: 'Created new candidate: John Developer', user: 'recruiter@aatoptalent.com', ip: '192.168.1.2', time: '2025-12-26 18:15:00' },
  { id: 3, type: 'update', action: 'Updated company: TechCorp Solutions', user: 'admin@aatoptalent.com', ip: '192.168.1.1', time: '2025-12-26 17:45:00' },
  { id: 4, type: 'create', action: 'Created new job: Senior Software Engineer', user: 'recruiter@aatoptalent.com', ip: '192.168.1.2', time: '2025-12-26 17:30:00' },
  { id: 5, type: 'update', action: 'Application status changed to Interview', user: 'recruiter@aatoptalent.com', ip: '192.168.1.2', time: '2025-12-26 17:00:00' },
  { id: 6, type: 'settings', action: 'System settings updated', user: 'admin@aatoptalent.com', ip: '192.168.1.1', time: '2025-12-26 16:30:00' },
  { id: 7, type: 'delete', action: 'Deleted candidate: Test User', user: 'admin@aatoptalent.com', ip: '192.168.1.1', time: '2025-12-26 16:00:00' },
  { id: 8, type: 'create', action: 'Created new company: StartupXYZ', user: 'recruiter@aatoptalent.com', ip: '192.168.1.2', time: '2025-12-26 15:30:00' },
  { id: 9, type: 'login', action: 'User logged in', user: 'recruiter@aatoptalent.com', ip: '192.168.1.2', time: '2025-12-26 15:00:00' },
  { id: 10, type: 'logout', action: 'User logged out', user: 'admin@aatoptalent.com', ip: '192.168.1.1', time: '2025-12-26 14:30:00' },
];

export default function ActivityPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredActivity = activityLog.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(search.toLowerCase()) ||
                         activity.user.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-gray-400 mt-1">Track all system activity and user actions</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Types</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="divide-y divide-gray-800">
          {filteredActivity.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No activity found</p>
            </div>
          ) : (
            filteredActivity.map((activity) => {
              const typeConfig = activityTypes[activity.type] || activityTypes.update;
              const Icon = typeConfig.icon;
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-800/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeConfig.bg}`}>
                    <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(activity.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
          <Database className="w-4 h-4 inline mr-2" />
          Export Log
        </button>
      </div>
    </div>
  );
}
