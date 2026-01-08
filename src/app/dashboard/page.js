'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Clock,
  UserPlus
} from 'lucide-react';

const stats = [
  {
    name: 'Total Candidates',
    value: '0',
    icon: Users,
    href: '/dashboard/candidates'
  },
  {
    name: 'Active Companies',
    value: '0',
    icon: Building2,
    href: '/dashboard/companies'
  },
  {
    name: 'Open Positions',
    value: '0',
    icon: Briefcase,
    href: '/dashboard/jobs'
  },
  {
    name: 'Placements (MTD)',
    value: '0',
    icon: TrendingUp,
    href: '/dashboard/placements'
  },
];

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [candidatesRes, companiesRes, jobsRes] = await Promise.all([
          fetch('/api/candidates?limit=1'),
          fetch('/api/companies?limit=1'),
          fetch('/api/jobs?status=open&limit=1')
        ]);

        const [candidatesData, companiesData, jobsData] = await Promise.all([
          candidatesRes.json(),
          companiesRes.json(),
          jobsRes.json()
        ]);

        setDashboardStats(prev => prev.map(stat => {
          if (stat.name === 'Total Candidates') {
            return { ...stat, value: String(candidatesData.total || 0) };
          }
          if (stat.name === 'Active Companies') {
            return { ...stat, value: String(companiesData.total || 0) };
          }
          if (stat.name === 'Open Positions') {
            return { ...stat, value: String(jobsData.total || 0) };
          }
          return stat;
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your recruiting pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {loading ? '-' : stat.value}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/candidates/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Candidate</span>
          </Link>
          <Link
            href="/dashboard/companies/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Building2 className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Company</span>
          </Link>
          <Link
            href="/dashboard/jobs/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </Link>
          <Link
            href="/dashboard/applications"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Clock className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Review Applications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
