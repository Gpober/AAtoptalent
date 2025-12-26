'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Activity,
  Database,
  Server,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalPlacements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [candidatesRes, companiesRes, jobsRes] = await Promise.all([
        fetch('/api/candidates?limit=1'),
        fetch('/api/companies?limit=1'),
        fetch('/api/jobs?limit=1')
      ]);

      const [candidatesData, companiesData, jobsData] = await Promise.all([
        candidatesRes.json(),
        companiesRes.json(),
        jobsRes.json()
      ]);

      setStats({
        totalUsers: 1, // Demo - would come from admin API
        totalCandidates: candidatesData.total || 0,
        totalCompanies: companiesData.total || 0,
        totalJobs: jobsData.total || 0,
        totalApplications: 0,
        totalPlacements: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const systemStats = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-600' },
    { name: 'Candidates', value: stats.totalCandidates, icon: UserPlus, color: 'bg-green-600' },
    { name: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'bg-purple-600' },
    { name: 'Open Jobs', value: stats.totalJobs, icon: Briefcase, color: 'bg-orange-600' },
  ];

  const recentActivity = [
    { id: 1, action: 'User login', user: 'admin@aatoptalent.com', time: '2 minutes ago', type: 'auth' },
    { id: 2, action: 'New candidate created', user: 'recruiter@aatoptalent.com', time: '15 minutes ago', type: 'create' },
    { id: 3, action: 'Company updated', user: 'admin@aatoptalent.com', time: '1 hour ago', type: 'update' },
    { id: 4, action: 'Job posting created', user: 'recruiter@aatoptalent.com', time: '2 hours ago', type: 'create' },
    { id: 5, action: 'Application status changed', user: 'recruiter@aatoptalent.com', time: '3 hours ago', type: 'update' },
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Storage', status: 'healthy', uptime: '100%' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400 mt-1">System statistics and monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white">
                  {loading ? '-' : stat.value}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link href="/admin/activity" className="text-sm text-red-500 hover:text-red-400 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'auth' ? 'bg-blue-600/20' :
                  activity.type === 'create' ? 'bg-green-600/20' :
                  'bg-yellow-600/20'
                }`}>
                  <Activity className={`w-5 h-5 ${
                    activity.type === 'auth' ? 'text-blue-500' :
                    activity.type === 'create' ? 'text-green-500' :
                    'text-yellow-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">System Health</h2>
            <span className="flex items-center text-sm text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              All systems operational
            </span>
          </div>
          <div className="space-y-4">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{service.name}</p>
                    <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.status === 'healthy'
                    ? 'bg-green-600/20 text-green-500'
                    : 'bg-red-600/20 text-red-500'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>

          {/* Database Info */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-white">Database Statistics</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Records</p>
                <p className="text-white font-medium">
                  {loading ? '-' : stats.totalCandidates + stats.totalCompanies + stats.totalJobs}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Storage Used</p>
                <p className="text-white font-medium">12.4 MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-white">Manage Users</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <Database className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-white">System Settings</span>
          </Link>
          <Link
            href="/admin/activity"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <Activity className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium text-white">Activity Log</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <Briefcase className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium text-white">Recruiter Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
